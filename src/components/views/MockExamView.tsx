import React, { useState, useEffect, useRef } from 'react';
import { Play, Mic, Square, ArrowRight, RotateCcw, Award, CheckCircle, Volume2, Info, Sparkles, AlertCircle } from 'lucide-react';
import { AUTHENTIC_EXAM_SETS } from '../../data/questionBank';
import { IELTSExamTopicSet, IELTSQuestion, QuestionResponseRecord, ExamSessionResult, UserPreferences } from '../../types/ielts';
import { speechService } from '../../services/speechService';
import { audioRecorderService } from '../../services/audioRecorder';
import { ScoringEngine } from '../../services/scoringEngine';
import { AICoachingService } from '../../services/aiCoachingService';
import { StorageService } from '../../services/storageService';
import { ExaminerAvatar } from '../ExaminerAvatar';
import { AudioVisualizer } from '../AudioVisualizer';
import { TimerDisplay } from '../TimerDisplay';
import { Scratchpad } from '../Scratchpad';
import { ScoreReportCard } from '../ScoreReportCard';

interface MockExamViewProps {
  preferences: UserPreferences;
  onOpenSettings: () => void;
}

type ExamPhase =
  | 'intro' // Examiner introduces the test & candidate ID check
  | 'part1' // Part 1 questions
  | 'part2_prep' // Part 2: 1-minute cue card preparation
  | 'part2_speak' // Part 2: 2-minute candidate monologue
  | 'part3' // Part 3: Two-way discussion
  | 'evaluating' // Computing final 4-pillar scores
  | 'report'; // Full Test Report Form

export const MockExamView: React.FC<MockExamViewProps> = ({ preferences, onOpenSettings }) => {
  const [selectedTopicSet, setSelectedTopicSet] = useState<IELTSExamTopicSet>(AUTHENTIC_EXAM_SETS[0]);
  const [phase, setPhase] = useState<ExamPhase>('intro');
  const [part1Index, setPart1Index] = useState(0);
  const [part3Index, setPart3Index] = useState(0);

  // Audio & Speech states
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [part2Notes, setPart2Notes] = useState('');

  // Timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // Response storage
  const [responses, setResponses] = useState<QuestionResponseRecord[]>([]);
  const [finalSessionResult, setFinalSessionResult] = useState<ExamSessionResult | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Current question resolver
  const getCurrentQuestion = (): IELTSQuestion => {
    if (phase === 'part1') return selectedTopicSet.part1Questions[part1Index];
    if (phase === 'part2_prep' || phase === 'part2_speak') return selectedTopicSet.part2CueCard;
    if (phase === 'part3') return selectedTopicSet.part3Questions[part3Index];
    return selectedTopicSet.part1Questions[0];
  };

  // Speak a prompt using SpeechSynthesis
  const speakExaminerPrompt = (text: string, onDone?: () => void) => {
    setIsExaminerSpeaking(true);
    speechService.speakText(text, {
      accent: preferences.examinerVoice.accent,
      rate: preferences.examinerVoice.rate,
      pitch: preferences.examinerVoice.pitch,
      onStart: () => setIsExaminerSpeaking(true),
      onEnd: () => {
        setIsExaminerSpeaking(false);
        if (onDone) onDone();
      }
    });
  };

  // 1. START FULL EXAM
  const handleStartExam = () => {
    setPhase('part1');
    setPart1Index(0);
    setResponses([]);
    setTranscript('');

    const firstQ = selectedTopicSet.part1Questions[0];
    const introText = `Good morning. My name is ${preferences.examinerVoice.examinerName}, and I will be your examiner today. Can you tell me your full name, please? Let's begin Part 1. Now, let's talk about ${firstQ.topic}. ${firstQ.prompt}`;
    speakExaminerPrompt(introText);
  };

  // 2. TOGGLE MIC RECORDING
  const handleStartAnswering = async () => {
    setTranscript('');
    setSpeakingSeconds(0);

    // Stop examiner audio if playing
    speechService.stopSpeaking();
    setIsExaminerSpeaking(false);

    // Start audio recorder for playback blob
    const recOk = await audioRecorderService.startRecording((freqs) => {
      setFrequencyData(freqs);
    });

    // Start live speech-to-text
    speechService.startListening((text) => {
      setTranscript(text);
    });

    setIsRecording(true);

    // Start countup timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setSpeakingSeconds((s) => s + 1);
    }, 1000);
  };

  // 3. FINISH CURRENT ANSWER & SUBMIT
  const handleStopAnswering = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRecording(false);
    speechService.stopListening();
    const { url: audioUrl } = await audioRecorderService.stopRecording();

    const currentQ = getCurrentQuestion();
    const duration = speakingSeconds;
    const answeredText = transcript || "(Candidate provided spoken response)";

    // Run AI / local diagnostic scoring
    const coaching = await AICoachingService.analyzeVoiceMessage(
      answeredText,
      currentQ.prompt,
      currentQ.part,
      duration,
      currentQ.topic,
      preferences.geminiApiKey
    );

    const record: QuestionResponseRecord = {
      questionId: currentQ.id,
      questionPrompt: currentQ.prompt,
      part: currentQ.part,
      userTranscript: answeredText,
      audioDurationSeconds: duration,
      audioBlobUrl: audioUrl,
      wordsPerMinute: coaching.wpm,
      wordCount: coaching.wordCount,
      detectedVocabulary: coaching.vocabularyBoost?.map(v => v.upgrade) || [],
      grammarNotes: coaching.grammarSlips?.map(g => `${g.mistake} -> ${g.correction}`) || [],
      criterionScores: {
        fc: coaching.scores.fc,
        lr: coaching.scores.lr,
        gra: coaching.scores.gra,
        p: coaching.scores.p
      },
      overallBand: coaching.overallBand,
      aiFeedbackSummary: coaching.summaryVerdict,
      modelAnswer: coaching.howToSayItBetter?.[0]?.band85Rewrite || currentQ.modelAnswerBand8
    };

    const updatedResponses = [...responses, record];
    setResponses(updatedResponses);
    setTranscript('');

    // Advance to next question or phase
    if (phase === 'part1') {
      if (part1Index < selectedTopicSet.part1Questions.length - 1) {
        const nextIdx = part1Index + 1;
        setPart1Index(nextIdx);
        const nextQ = selectedTopicSet.part1Questions[nextIdx];
        speakExaminerPrompt(`Thank you. Now, ${nextQ.prompt}`);
      } else {
        // Move to Part 2 Preparation
        setPhase('part2_prep');
        setPrepTimeLeft(60);
        const cueIntro = `Thank you. Now, I am going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here is your topic.`;
        speakExaminerPrompt(cueIntro, () => {
          startPart2Countdown();
        });
      }
    } else if (phase === 'part2_speak') {
      // Move to Part 3
      setPhase('part3');
      setPart3Index(0);
      const firstP3 = selectedTopicSet.part3Questions[0];
      const p3Intro = `Thank you. We've been talking about ${selectedTopicSet.part2CueCard.topic}, and now I'd like to discuss with you one or two more general questions related to this. Let's consider ${firstP3.topic}. ${firstP3.prompt}`;
      speakExaminerPrompt(p3Intro);
    } else if (phase === 'part3') {
      if (part3Index < selectedTopicSet.part3Questions.length - 1) {
        const nextIdx = part3Index + 1;
        setPart3Index(nextIdx);
        const nextQ = selectedTopicSet.part3Questions[nextIdx];
        speakExaminerPrompt(`I see. ${nextQ.prompt}`);
      } else {
        // Complete Full Mock Exam!
        finishFullExam(updatedResponses);
      }
    }
  };

  // PART 2 60s COUNTDOWN
  const startPart2Countdown = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    let timeLeft = 60;
    setPrepTimeLeft(60);

    timerIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setPrepTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        // Prompt candidate to begin speaking
        setPhase('part2_speak');
        speakExaminerPrompt("All right, remember you have one to two minutes for this. Don't worry if I stop you. Please begin speaking now.", () => {
          handleStartAnswering();
        });
      }
    }, 1000);
  };

  // Skip prep timer early if candidate is ready
  const handleSkipPrepTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setPhase('part2_speak');
    speakExaminerPrompt("Very well. Please begin speaking now.", () => {
      handleStartAnswering();
    });
  };

  // FINALIZE FULL EXAM
  const finishFullExam = (allResponses: QuestionResponseRecord[]) => {
    setPhase('evaluating');
    speechService.speakText("Thank you very much. That is the end of the speaking test.", {
      accent: preferences.examinerVoice.accent
    });

    // Compute composite score
    const avgFC = allResponses.reduce((acc, r) => acc + r.criterionScores.fc, 0) / allResponses.length;
    const avgLR = allResponses.reduce((acc, r) => acc + r.criterionScores.lr, 0) / allResponses.length;
    const avgGRA = allResponses.reduce((acc, r) => acc + r.criterionScores.gra, 0) / allResponses.length;
    const avgP = allResponses.reduce((acc, r) => acc + r.criterionScores.p, 0) / allResponses.length;

    const roundHalf = (val: number) => Math.min(9.0, Math.max(4.0, Math.round(val * 2) / 2));
    const finalScores = {
      fc: roundHalf(avgFC),
      lr: roundHalf(avgLR),
      gra: roundHalf(avgGRA),
      p: roundHalf(avgP)
    };

    const overallBand = roundHalf((finalScores.fc + finalScores.lr + finalScores.gra + finalScores.p) / 4);

    const sessionResult: ExamSessionResult = {
      id: `exam-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      mode: 'full_mock',
      topicTheme: selectedTopicSet.theme,
      responses: allResponses,
      overallBand,
      scores: finalScores,
      summaryVerdict: overallBand >= 7.5
        ? "Exemplary performance across all 3 test parts with spontaneous fluency and complex lexical range."
        : overallBand >= 6.5
        ? "Solid candidate performance with clear coherence. Push your vocabulary collocations and varied grammatical clauses for Band 7+."
        : "Developing speaker. Practice expanding Part 2 cue cards and signposting Part 3 abstract arguments.",
      actionPlan: [
        "Incorporate more flexible discourse markers ('on the flip side', 'to put it into perspective').",
        "Maintain Part 2 speaking past 1 minute 45 seconds to demonstrate sustained discourse.",
        "Use advanced collocations rather than general adjectives."
      ],
      examinerNotes: `Candidate completed ${allResponses.length} speaking tasks covering Part 1 familiar questions, Part 2 individual long turn, and Part 3 abstract reasoning.`
    };

    // Save to storage
    StorageService.saveExamResult(sessionResult);

    setTimeout(() => {
      setFinalSessionResult(sessionResult);
      setPhase('report');
    }, 1500);
  };

  const currentQ = getCurrentQuestion();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Test Phase Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <span className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Official IELTS Mock Examination
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {selectedTopicSet.theme}
          </span>
        </div>

        {/* Phase Badges */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[
            { id: 'part1', label: 'Part 1: Interview' },
            { id: 'part2', label: 'Part 2: Cue Card' },
            { id: 'part3', label: 'Part 3: Discussion' },
            { id: 'report', label: 'Full TRF Report' },
          ].map((item) => {
            const isCurrent =
              (item.id === 'part1' && phase === 'part1') ||
              (item.id === 'part2' && (phase === 'part2_prep' || phase === 'part2_speak')) ||
              (item.id === 'part3' && phase === 'part3') ||
              (item.id === 'report' && (phase === 'report' || phase === 'evaluating'));

            return (
              <span
                key={item.id}
                className={`px-3 py-1 rounded-xl transition ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* PHASE 0: INTRO SCREEN */}
      {phase === 'intro' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-200 dark:border-red-900">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Full IELTS Speaking Mock Exam
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Experience an authentic 11-14 minute IELTS interview with a virtual examiner. Includes live Speech-to-Text transcription, cue card notepad, audio recorder, and an official 4-pillar band score evaluation.
          </p>

          {/* Exam Structure Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">
                Part 1 (4-5 mins)
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                Familiar Topics
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Introduction & warm-up questions regarding home, work, technology, or habits.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">
                Part 2 (3-4 mins)
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                Individual Long Turn
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-minute preparation with notes, followed by a continuous 1-2 minute speech.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">
                Part 3 (4-5 mins)
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                Two-way Discussion
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                In-depth, abstract societal questions expanding upon Part 2 themes.
              </p>
            </div>
          </div>

          {/* Topic Selector */}
          <div className="mb-8 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Exam Topic Set:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUTHENTIC_EXAM_SETS.map((set) => (
                <div
                  key={set.id}
                  onClick={() => setSelectedTopicSet(set)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedTopicSet.id === set.id
                      ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 shadow-md ring-2 ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      {set.difficulty}
                    </span>
                    {selectedTopicSet.id === set.id && (
                      <CheckCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {set.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {set.theme}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Examiner Voice Info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-8 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span>Examiner Voice: <strong>{preferences.examinerVoice.examinerName} ({preferences.examinerVoice.accent})</strong></span>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-red-600 dark:text-red-400 font-bold hover:underline"
            >
              Change Voice / Settings
            </button>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-base shadow-xl shadow-red-600/25 transition flex items-center justify-center gap-3 mx-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            Begin Official Mock Exam
          </button>
        </div>
      )}

      {/* PHASE: ACTIVE TEST (PART 1, PART 2 PREP, PART 2 SPEAK, PART 3) */}
      {(phase === 'part1' || phase === 'part2_prep' || phase === 'part2_speak' || phase === 'part3') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Examiner Avatar & Visualizer */}
          <div className="lg:col-span-5 space-y-6">
            <ExaminerAvatar
              isSpeaking={isExaminerSpeaking}
              isListening={isRecording}
              examinerName={preferences.examinerVoice.examinerName}
              accent={preferences.examinerVoice.accent}
              onReplayQuestion={() => speakExaminerPrompt(currentQ.prompt)}
              statusText={
                isExaminerSpeaking
                  ? 'Examiner is asking the question...'
                  : isRecording
                  ? 'Candidate is speaking (recording active)...'
                  : phase === 'part2_prep'
                  ? 'Candidate preparation phase (1:00)...'
                  : 'Press Start Speaking when ready.'
              }
            />

            {/* Live Audio Waveform */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Microphone Waveform</span>
                <span>{isRecording ? 'LIVE INPUT' : 'STANDBY'}</span>
              </div>
              <AudioVisualizer isRecording={isRecording} frequencyData={frequencyData} />
            </div>

            {/* Response Timer */}
            {phase === 'part2_prep' && (
              <TimerDisplay
                mode="countdown"
                seconds={prepTimeLeft}
                totalDuration={60}
              />
            )}

            {phase === 'part2_speak' && (
              <TimerDisplay
                mode="countup"
                seconds={speakingSeconds}
                totalDuration={120}
                isPart2Speaking={true}
              />
            )}

            {(phase === 'part1' || phase === 'part3') && isRecording && (
              <div className="flex justify-center">
                <TimerDisplay
                  mode="countup"
                  seconds={speakingSeconds}
                />
              </div>
            )}
          </div>

          {/* Right Column: Question Card & Candidate Interaction */}
          <div className="lg:col-span-7 space-y-6">
            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-black text-xs uppercase tracking-wider">
                    {phase === 'part1'
                      ? `Part 1 • Question ${part1Index + 1} of ${selectedTopicSet.part1Questions.length}`
                      : phase === 'part2_prep'
                      ? 'Part 2 • 1-Minute Preparation'
                      : phase === 'part2_speak'
                      ? 'Part 2 • 2-Minute Long Turn'
                      : `Part 3 • Question ${part3Index + 1} of ${selectedTopicSet.part3Questions.length}`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Topic: {currentQ.topic}
                  </span>
                </div>
              </div>

              {/* Main Prompt */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-4">
                {currentQ.prompt}
              </h3>

              {/* Part 2 Cue Card Sub-bullets */}
              {currentQ.subPrompts && currentQ.subPrompts.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 mb-6">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 mb-3">
                    You should say:
                  </h5>
                  <ul className="space-y-2 text-sm text-amber-950 dark:text-amber-100">
                    {currentQ.subPrompts.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Digital Scratchpad during Part 2 */}
              {(phase === 'part2_prep' || phase === 'part2_speak') && (
                <div className="mb-6">
                  <Scratchpad
                    notes={part2Notes}
                    onChange={setPart2Notes}
                    subPrompts={currentQ.subPrompts}
                  />
                  {phase === 'part2_prep' && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleSkipPrepTimer}
                        className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                      >
                        Skip remaining prep time & start speaking now →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Live Speech-to-Text Transcription Box */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" />
                    Live Speech Transcription
                  </span>
                  {isRecording && (
                    <span className="text-emerald-500 font-bold animate-pulse">
                      ● Listening to candidate
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 min-h-24 max-h-48 overflow-y-auto text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                  {transcript ? (
                    <span>{transcript}</span>
                  ) : (
                    <span className="text-slate-400 italic font-sans text-xs">
                      {isRecording
                        ? "Speak clearly into your microphone; your spoken words will appear here in real time..."
                        : "Press 'Start Speaking' below when ready to begin your answer."}
                    </span>
                  )}
                </div>
              </div>

              {/* Candidate Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                {!isRecording ? (
                  <button
                    onClick={handleStartAnswering}
                    disabled={isExaminerSpeaking}
                    className="flex-1 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-3"
                  >
                    <Mic className="w-5 h-5 fill-current" />
                    Start Speaking (Candidate Answer)
                  </button>
                ) : (
                  <button
                    onClick={handleStopAnswering}
                    className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-base shadow-lg transition flex items-center justify-center gap-3"
                  >
                    <Square className="w-4 h-4 fill-current text-red-500" />
                    Finish & Submit Response
                  </button>
                )}
              </div>
            </div>

            {/* Quick Strategy Tip for Current Part */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Examiner Guidance:</strong> {currentQ.tips}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE: EVALUATING */}
      {phase === 'evaluating' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Examiner Computing Test Report Form...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analyzing Fluency & Coherence, Lexical Resource, Grammatical Variety, and Pronunciation against Cambridge IELTS criteria.
          </p>
        </div>
      )}

      {/* PHASE: FULL FINAL REPORT */}
      {phase === 'report' && finalSessionResult && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                  Test Complete • Official Candidate Report
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                  IELTS Speaking Band {finalSessionResult.overallBand.toFixed(1)}
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  {finalSessionResult.summaryVerdict}
                </p>
              </div>

              {/* 4 Pillars Mini Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Fluency (FC)', score: finalSessionResult.scores.fc },
                  { label: 'Lexical (LR)', score: finalSessionResult.scores.lr },
                  { label: 'Grammar (GRA)', score: finalSessionResult.scores.gra },
                  { label: 'Pronunciation (P)', score: finalSessionResult.scores.p },
                ].map((crit) => (
                  <div key={crit.label} className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                    <span className="text-[11px] text-slate-400 font-semibold block">{crit.label}</span>
                    <span className="text-2xl font-black text-white">{crit.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="mt-8 pt-6 border-t border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Targeted Action Plan for Band {preferences.targetBand.toFixed(1)}:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {finalSessionResult.actionPlan.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Breakdown per response */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Individual Question Performance Breakdown
            </h3>
            {finalSessionResult.responses.map((resp, index) => {
              const matchedQ =
                selectedTopicSet.part1Questions.find(q => q.id === resp.questionId) ||
                (selectedTopicSet.part2CueCard.id === resp.questionId ? selectedTopicSet.part2CueCard : null) ||
                selectedTopicSet.part3Questions.find(q => q.id === resp.questionId) ||
                selectedTopicSet.part1Questions[0];

              return (
                <div key={resp.questionId} className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                      Part {resp.part} Question {index + 1}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                      Band {resp.overallBand.toFixed(1)}
                    </span>
                  </div>

                  <ScoreReportCard
                    scoring={{
                      overallBand: resp.overallBand,
                      fc: {
                        criterion: 'Fluency & Coherence',
                        code: 'FC',
                        score: resp.criterionScores.fc,
                        strengths: [`Tempo: ${resp.wordsPerMinute} WPM`],
                        improvements: ['Practice spontaneous flow'],
                        observedFeatures: []
                      },
                      lr: {
                        criterion: 'Lexical Resource',
                        code: 'LR',
                        score: resp.criterionScores.lr,
                        strengths: resp.detectedVocabulary.slice(0, 3),
                        improvements: ['Upgrade everyday verbs with formal collocations'],
                        observedFeatures: resp.detectedVocabulary
                      },
                      gra: {
                        criterion: 'Grammatical Range & Accuracy',
                        code: 'GRA',
                        score: resp.criterionScores.gra,
                        strengths: resp.grammarNotes,
                        improvements: ['Add conditional sentences'],
                        observedFeatures: resp.grammarNotes
                      },
                      p: {
                        criterion: 'Pronunciation',
                        code: 'P',
                        score: resp.criterionScores.p,
                        strengths: ['Clear delivery and recognizable stress'],
                        improvements: ['Work on intonation modulation'],
                        observedFeatures: []
                      },
                      detectedVocabulary: resp.detectedVocabulary,
                      grammarNotes: resp.grammarNotes,
                      summaryVerdict: resp.aiFeedbackSummary,
                      wpm: resp.wordsPerMinute,
                      wordCount: resp.wordCount
                    }}
                    question={matchedQ}
                    userTranscript={resp.userTranscript}
                    audioBlobUrl={resp.audioBlobUrl}
                    targetBand={preferences.targetBand}
                    onRetake={() => {
                      setPhase('part1');
                      setResponses([]);
                    }}
                    isFullExamFinal={true}
                  />
                </div>
              );
            })}
          </div>

          {/* Reset / New Test button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={() => {
                setPhase('intro');
                setResponses([]);
                setFinalSessionResult(null);
              }}
              className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Take Another Full Mock Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
