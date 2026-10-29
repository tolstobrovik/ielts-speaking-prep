import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, Sparkles, Filter, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { ALL_PART_QUESTIONS } from '../../data/questionBank';
import { IELTSQuestion, IELTSPart, UserPreferences } from '../../types/ielts';
import { speechService } from '../../services/speechService';
import { audioRecorderService } from '../../services/audioRecorder';
import { ScoringEngine, ScoringResult } from '../../services/scoringEngine';
import { AICoachingService } from '../../services/aiCoachingService';
import { ExaminerAvatar } from '../ExaminerAvatar';
import { AudioVisualizer } from '../AudioVisualizer';
import { TimerDisplay } from '../TimerDisplay';
import { Scratchpad } from '../Scratchpad';
import { ScoreReportCard } from '../ScoreReportCard';

interface PartPracticeViewProps {
  preferences: UserPreferences;
  onOpenSettings: () => void;
}

export const PartPracticeView: React.FC<PartPracticeViewProps> = ({ preferences, onOpenSettings }) => {
  const [selectedPart, setSelectedPart] = useState<IELTSPart>(2);
  const [currentQuestions, setCurrentQuestions] = useState<IELTSQuestion[]>(ALL_PART_QUESTIONS.part2);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // States
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [scratchNotes, setScratchNotes] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedPart === 1) setCurrentQuestions(ALL_PART_QUESTIONS.part1);
    else if (selectedPart === 2) setCurrentQuestions(ALL_PART_QUESTIONS.part2);
    else setCurrentQuestions(ALL_PART_QUESTIONS.part3);
    setSelectedIndex(0);
    resetQuestionState();
  }, [selectedPart]);

  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetQuestionState = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPrepping(false);
    setIsRecording(false);
    setTranscript('');
    setScratchNotes('');
    setAudioUrl(undefined);
    setScoringResult(null);
    setSpeakingSeconds(0);
    setPrepSeconds(60);
  };

  const currentQ = currentQuestions[selectedIndex] || currentQuestions[0];

  const handleSpeakQuestion = () => {
    setIsExaminerSpeaking(true);
    speechService.speakText(currentQ.prompt, {
      accent: preferences.examinerVoice.accent,
      rate: preferences.examinerVoice.rate,
      pitch: preferences.examinerVoice.pitch,
      onStart: () => setIsExaminerSpeaking(true),
      onEnd: () => setIsExaminerSpeaking(false)
    });
  };

  // Start 1-minute prep for Part 2
  const handleStartPrep = () => {
    setIsPrepping(true);
    setPrepSeconds(60);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setPrepSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsPrepping(false);
          handleStartRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStartRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPrepping(false);
    setTranscript('');
    setSpeakingSeconds(0);
    setScoringResult(null);

    speechService.stopSpeaking();
    setIsExaminerSpeaking(false);

    await audioRecorderService.startRecording((freqs) => {
      setFrequencyData(freqs);
    });

    speechService.startListening((text) => {
      setTranscript(text);
    });

    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setSpeakingSeconds((s) => s + 1);
    }, 1000);
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    speechService.stopListening();
    const { url } = await audioRecorderService.stopRecording();
    setAudioUrl(url);

    const answeredText = transcript || "(Candidate provided spoken answer)";
    const coaching = await AICoachingService.analyzeVoiceMessage(
      answeredText,
      currentQ.prompt,
      selectedPart,
      speakingSeconds,
      currentQ.topic,
      preferences.geminiApiKey
    );

    const result: ScoringResult = {
      overallBand: coaching.overallBand,
      fc: {
        criterion: 'Fluency & Coherence',
        code: 'FC',
        score: coaching.scores.fc,
        strengths: [`Tempo: ${coaching.wpm} WPM`, coaching.fillerWordStats?.pacingAdvice || 'Good delivery'],
        improvements: [coaching.examinerDirectTip || 'Elaborate further'],
        observedFeatures: []
      },
      lr: {
        criterion: 'Lexical Resource',
        code: 'LR',
        score: coaching.scores.lr,
        strengths: coaching.vocabularyBoost?.map(v => `${v.original} -> ${v.upgrade}`) || [],
        improvements: ['Incorporate more academic collocations'],
        observedFeatures: coaching.vocabularyBoost?.map(v => v.upgrade) || []
      },
      gra: {
        criterion: 'Grammatical Range & Accuracy',
        code: 'GRA',
        score: coaching.scores.gra,
        strengths: ['Clear sentence formulation'],
        improvements: coaching.grammarSlips?.map(g => `${g.mistake}: ${g.rule}`) || ['Use varied conditionals'],
        observedFeatures: []
      },
      p: {
        criterion: 'Pronunciation',
        code: 'P',
        score: coaching.scores.p,
        strengths: ['Good acoustic rhythm and clarity'],
        improvements: ['Focus on natural intonation at clause boundaries'],
        observedFeatures: []
      },
      detectedVocabulary: coaching.vocabularyBoost?.map(v => v.upgrade) || [],
      grammarNotes: coaching.grammarSlips?.map(g => `${g.mistake} -> ${g.correction}`) || [],
      summaryVerdict: coaching.summaryVerdict,
      wpm: coaching.wpm,
      wordCount: coaching.wordCount
    };
    setScoringResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner / Part Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Targeted Part Practice Drill
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Focus and master specific parts of the IELTS test at your own pace.
          </p>
        </div>

        {/* Part Selection Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {[
            { part: 1, label: 'Part 1: Interview' },
            { part: 2, label: 'Part 2: Cue Card' },
            { part: 3, label: 'Part 3: Discussion' },
          ].map((item) => (
            <button
              key={item.part}
              onClick={() => {
                setSelectedPart(item.part as IELTSPart);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedPart === item.part
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Practice Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Examiner & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <ExaminerAvatar
            isSpeaking={isExaminerSpeaking}
            isListening={isRecording}
            examinerName={preferences.examinerVoice.examinerName}
            accent={preferences.examinerVoice.accent}
            onReplayQuestion={handleSpeakQuestion}
            statusText={
              isExaminerSpeaking
                ? 'Examiner speaking question...'
                : isPrepping
                ? 'Part 2: 1-minute prep timer running...'
                : isRecording
                ? 'Candidate microphone active...'
                : 'Ready for response.'
            }
          />

          <AudioVisualizer isRecording={isRecording} frequencyData={frequencyData} />

          {/* Timers */}
          {selectedPart === 2 && isPrepping && (
            <TimerDisplay
              mode="countdown"
              seconds={prepSeconds}
              totalDuration={60}
            />
          )}

          {selectedPart === 2 && isRecording && (
            <TimerDisplay
              mode="countup"
              seconds={speakingSeconds}
              totalDuration={120}
              isPart2Speaking={true}
            />
          )}

          {(selectedPart === 1 || selectedPart === 3) && isRecording && (
            <div className="flex justify-center">
              <TimerDisplay mode="countup" seconds={speakingSeconds} />
            </div>
          )}

          {/* Question List Picker */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Available Questions ({currentQuestions.length})</span>
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    resetQuestionState();
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedIndex === idx
                      ? 'border-red-600 bg-red-50/40 dark:bg-red-950/30 font-bold text-red-900 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold mb-0.5">
                    {q.topic}
                  </div>
                  <div className="line-clamp-2">{q.prompt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Question & Interaction */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                Part {selectedPart} Practice • Question {selectedIndex + 1}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentQ.topic}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-4">
              {currentQ.prompt}
            </h3>

            {/* Cue Card sub prompts */}
            {selectedPart === 2 && currentQ.subPrompts && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 mb-6">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 mb-2">
                  You should say:
                </h5>
                <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-100">
                  {currentQ.subPrompts.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Part 2 Scratchpad */}
            {selectedPart === 2 && (
              <div className="mb-6">
                <Scratchpad
                  notes={scratchNotes}
                  onChange={setScratchNotes}
                  subPrompts={currentQ.subPrompts}
                />
              </div>
            )}

            {/* Speech Transcript Output */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  Live Transcription
                </span>
                {isRecording && (
                  <span className="text-emerald-500 font-bold animate-pulse">
                    ● Recording candidate speech
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 min-h-24 max-h-48 overflow-y-auto text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                {transcript ? (
                  <span>{transcript}</span>
                ) : (
                  <span className="text-slate-400 italic font-sans text-xs">
                    {isPrepping
                      ? "Use this minute to jot ideas in the scratchpad. Speech recognition will begin automatically when the timer reaches 0."
                      : isRecording
                      ? "Speak now; your answer will be transcribed and graded across all 4 IELTS criteria..."
                      : "Click 'Start Speaking' (or '1-Min Prep' for Part 2) to practice."}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              {selectedPart === 2 && !isPrepping && !isRecording && (
                <button
                  onClick={handleStartPrep}
                  className="px-5 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition"
                >
                  Start 1-Min Prep Countdown
                </button>
              )}

              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  disabled={isExaminerSpeaking}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2.5"
                >
                  <Mic className="w-4 h-4 fill-current" />
                  Start Speaking Now
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-sm shadow-lg transition flex items-center justify-center gap-2.5"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-red-500" />
                  Finish & Grade Answer
                </button>
              )}
            </div>
          </div>

          {/* Instant Scoring Report Card when graded */}
          {scoringResult && (
            <div className="transition-all animate-fadeIn">
              <ScoreReportCard
                scoring={scoringResult}
                question={currentQ}
                userTranscript={transcript}
                audioBlobUrl={audioUrl}
                targetBand={preferences.targetBand}
                onRetake={resetQuestionState}
                onNext={() => {
                  if (selectedIndex < currentQuestions.length - 1) {
                    setSelectedIndex(selectedIndex + 1);
                    resetQuestionState();
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
