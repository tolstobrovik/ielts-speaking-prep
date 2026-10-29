import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, Send, Sparkles, Volume2, RotateCcw, HelpCircle, Award, Compass, ArrowRight } from 'lucide-react';
import { VoiceChatMessage, UserPreferences, IELTSPart } from '../../types/ielts';
import { AUTHENTIC_EXAM_SETS } from '../../data/questionBank';
import { speechService } from '../../services/speechService';
import { audioRecorderService } from '../../services/audioRecorder';
import { AICoachingService } from '../../services/aiCoachingService';
import { VoiceMessageBubble } from '../VoiceMessageBubble';
import { AudioVisualizer } from '../AudioVisualizer';

interface VoiceExaminerChatViewProps {
  preferences: UserPreferences;
  onOpenSettings: () => void;
}

export const VoiceExaminerChatView: React.FC<VoiceExaminerChatViewProps> = ({
  preferences,
  onOpenSettings
}) => {
  const [topicSet, setTopicSet] = useState(AUTHENTIC_EXAM_SETS[0]);
  const [currentPart, setCurrentPart] = useState<IELTSPart>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Messages thread
  const [messages, setMessages] = useState<VoiceChatMessage[]>([]);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIdeaDrawer, setShowIdeaDrawer] = useState(false);
  const [typedInput, setTypedInput] = useState('');

  const timerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const activeQuestion =
    currentPart === 1
      ? topicSet.part1Questions[currentQuestionIndex] || topicSet.part1Questions[0]
      : currentPart === 2
      ? topicSet.part2CueCard
      : topicSet.part3Questions[currentQuestionIndex] || topicSet.part3Questions[0];

  // Initialize first examiner message
  useEffect(() => {
    const welcomeMsg: VoiceChatMessage = {
      id: 'msg-welcome',
      sender: 'examiner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello and welcome. I am ${preferences.examinerVoice.examinerName}, your IELTS examiner. Let's begin Part ${currentPart}. We'll discuss ${activeQuestion.topic}. Here is your question: ${activeQuestion.prompt}`,
      topic: activeQuestion.topic,
      part: currentPart
    };

    setMessages([welcomeMsg]);

    // Speak initial welcome
    speakText(welcomeMsg.text);

    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topicSet, currentPart]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing, liveTranscript]);

  const speakText = (text: string, onEnd?: () => void) => {
    setIsExaminerSpeaking(true);
    speechService.speakText(text, {
      accent: preferences.examinerVoice.accent,
      rate: preferences.examinerVoice.rate,
      pitch: preferences.examinerVoice.pitch,
      onStart: () => setIsExaminerSpeaking(true),
      onEnd: () => {
        setIsExaminerSpeaking(false);
        if (onEnd) onEnd();
      }
    });
  };

  // 1. START RECORDING
  const handleStartRecording = async () => {
    speechService.stopSpeaking();
    setIsExaminerSpeaking(false);

    setLiveTranscript('');
    setRecordingSeconds(0);
    setIsRecording(true);

    await audioRecorderService.startRecording((freqs) => {
      setFrequencyData(freqs);
    });

    speechService.startListening((text) => {
      setLiveTranscript(text);
    });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  };

  // 2. CANCEL RECORDING
  const handleCancelRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    speechService.stopListening();
    await audioRecorderService.stopRecording();
    setLiveTranscript('');
    setRecordingSeconds(0);
  };

  // 3. SEND VOICE MESSAGE & GET INSTANT FEEDBACK
  const handleSendVoiceMessage = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    speechService.stopListening();
    const duration = recordingSeconds;
    const { url: audioUrl } = await audioRecorderService.stopRecording();

    const transcriptToAnalyze = liveTranscript.trim() || "(Candidate spoke a response without transcript)";
    setLiveTranscript('');
    setRecordingSeconds(0);
    setIsAnalyzing(true);

    // Call AI Coaching Service
    const feedback = await AICoachingService.analyzeVoiceMessage(
      transcriptToAnalyze,
      activeQuestion.prompt,
      currentPart,
      duration,
      activeQuestion.topic,
      preferences.geminiApiKey
    );

    // Add candidate voice message with feedback
    const candidateMsg: VoiceChatMessage = {
      id: `msg-candidate-${Date.now()}`,
      sender: 'candidate',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: transcriptToAnalyze,
      audioBlobUrl: audioUrl,
      audioDurationSeconds: duration,
      feedback,
      topic: activeQuestion.topic,
      part: currentPart
    };

    setMessages((prev) => [...prev, candidateMsg]);
    setIsAnalyzing(false);

    // Examiner responds naturally with follow-up
    setTimeout(() => {
      const examinerReplyText = feedback.examinerFollowUp || "Thank you. Let's move to the next aspect of this topic.";
      const examinerMsg: VoiceChatMessage = {
        id: `msg-examiner-${Date.now()}`,
        sender: 'examiner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: examinerReplyText,
        topic: activeQuestion.topic,
        part: currentPart
      };

      setMessages((prev) => [...prev, examinerMsg]);
      speakText(examinerReplyText);
    }, 800);
  };

  const handleSendTypedMessage = async () => {
    if (!typedInput.trim()) return;
    const textToSend = typedInput.trim();
    setTypedInput('');
    setIsAnalyzing(true);

    const wordCount = textToSend.split(/\s+/).length;
    const estimatedSeconds = Math.max(10, Math.round(wordCount / 2.2));

    const feedback = await AICoachingService.analyzeVoiceMessage(
      textToSend,
      activeQuestion.prompt,
      currentPart,
      estimatedSeconds,
      activeQuestion.topic,
      preferences.geminiApiKey
    );

    const candidateMsg: VoiceChatMessage = {
      id: `msg-candidate-${Date.now()}`,
      sender: 'candidate',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
      audioDurationSeconds: estimatedSeconds,
      feedback,
      topic: activeQuestion.topic,
      part: currentPart
    };

    setMessages((prev) => [...prev, candidateMsg]);
    setIsAnalyzing(false);

    setTimeout(() => {
      const examinerReplyText = feedback.examinerFollowUp || "Thank you. Let's explore that further.";
      const examinerMsg: VoiceChatMessage = {
        id: `msg-examiner-${Date.now()}`,
        sender: 'examiner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: examinerReplyText,
        topic: activeQuestion.topic,
        part: currentPart
      };

      setMessages((prev) => [...prev, examinerMsg]);
      speakText(examinerReplyText);
    }, 800);
  };

  const handleNextQuestion = () => {
    if (currentPart === 1) {
      const maxIdx = topicSet.part1Questions.length - 1;
      const nextIdx = currentQuestionIndex < maxIdx ? currentQuestionIndex + 1 : 0;
      setCurrentQuestionIndex(nextIdx);
      const q = topicSet.part1Questions[nextIdx];
      const text = `Let's discuss another aspect: ${q.prompt}`;
      addExaminerMessage(text, q.topic);
    } else if (currentPart === 3) {
      const maxIdx = topicSet.part3Questions.length - 1;
      const nextIdx = currentQuestionIndex < maxIdx ? currentQuestionIndex + 1 : 0;
      setCurrentQuestionIndex(nextIdx);
      const q = topicSet.part3Questions[nextIdx];
      const text = `Now, ${q.prompt}`;
      addExaminerMessage(text, q.topic);
    }
  };

  const addExaminerMessage = (text: string, topic: string) => {
    const msg: VoiceChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'examiner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      topic,
      part: currentPart
    };
    setMessages((prev) => [...prev, msg]);
    speakText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col h-[calc(100dvh-9.5rem)] md:h-[calc(100dvh-6rem)]">
      {/* Top Bar: Topic, Part, and Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Live AI Examiner Dialogue
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Instant Voice Feedback
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send voice messages to get instant Band scores and "How to Say It Better" upgrades.
            </p>
          </div>
        </div>

        {/* Part Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          {[
            { part: 1, label: 'Part 1' },
            { part: 2, label: 'Part 2 Cue Card' },
            { part: 3, label: 'Part 3 Discussion' },
          ].map((item) => (
            <button
              key={item.part}
              onClick={() => {
                setCurrentPart(item.part as IELTSPart);
                setCurrentQuestionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                currentPart === item.part
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 pr-2">
        {messages.map((msg) => (
          <VoiceMessageBubble
            key={msg.id}
            message={msg}
            examinerAccent={preferences.examinerVoice.accent}
            onPlayModelAudio={(text) => speakText(text)}
          />
        ))}

        {/* Analyzing / Processing Animation */}
        {isAnalyzing && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-semibold animate-pulse max-w-md ml-auto">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>AI Examiner is assessing your voice across Cambridge 4-Pillars...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Helpers Drawer */}
      {showIdeaDrawer && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-3xl p-4 mb-3 shadow-lg flex-shrink-0 animate-fadeIn text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              PEEL Idea Helper for: "{activeQuestion.prompt}"
            </span>
            <button
              onClick={() => setShowIdeaDrawer(false)}
              className="text-amber-700 hover:text-amber-900 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-amber-950 dark:text-amber-100">
            <div><strong>P (Point):</strong> State your direct stance using: "Without a doubt, I contend that..."</div>
            <div><strong>E (Explain):</strong> Give the underlying reason: "The primary rationale behind this is..."</div>
            <div><strong>E (Example):</strong> Provide a concrete case: "To put it into perspective, in my own experience..."</div>
            <div><strong>L (Link):</strong> Conclude your thought: "Hence, it has become second nature."</div>
          </div>
        </div>
      )}

      {/* Live Recording Waveform & Preview (Active while speaking) */}
      {isRecording && (
        <div className="bg-slate-900 text-white rounded-3xl p-4 mb-3 shadow-2xl border border-slate-800 space-y-3 flex-shrink-0 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-red-400">RECORDING VOICE MESSAGE</span>
              <span className="text-slate-400 font-mono">
                {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Speak clearly into your microphone
            </span>
          </div>

          <AudioVisualizer isRecording={isRecording} frequencyData={frequencyData} />

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200 max-h-24 overflow-y-auto">
            {liveTranscript ? (
              <span>{liveTranscript}</span>
            ) : (
              <span className="text-slate-400 italic">Listening to your speech in real time...</span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Voice Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xl flex-shrink-0">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 text-xs">
          <button
            onClick={() => setShowIdeaDrawer(!showIdeaDrawer)}
            className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-amber-100 transition"
          >
            <HelpCircle className="w-3 h-3" />
            Need Ideas? (PEEL Helper)
          </button>

          <button
            onClick={() => speakText(activeQuestion.prompt)}
            disabled={isExaminerSpeaking}
            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-slate-200 transition"
          >
            <Volume2 className="w-3 h-3 text-red-500" />
            Repeat Question Voice
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-slate-200 transition"
          >
            <ArrowRight className="w-3 h-3 text-blue-500" />
            Next Question
          </button>
          <button
            onClick={() => {
              setTypedInput(activeQuestion.modelAnswerBand8.split('.')[0] + '. ' + (activeQuestion.modelAnswerBand8.split('.')[1] || '') + '.');
            }}
            className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold whitespace-nowrap flex items-center gap-1 hover:bg-purple-100 transition border border-purple-200 dark:border-purple-800"
          >
            <Sparkles className="w-3 h-3 text-purple-500" />
            Fill Sample Answer
          </button>
        </div>

        {/* Big Voice Button Bar & Text Fallback */}
        <div className="space-y-2">
          {!isRecording ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendTypedMessage();
                }}
                placeholder="Type your response here or click the mic to speak..."
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {typedInput.trim() ? (
                <button
                  onClick={handleSendTypedMessage}
                  disabled={isAnalyzing}
                  className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>Send</span>
                </button>
              ) : null}

              <button
                onClick={handleStartRecording}
                disabled={isExaminerSpeaking || isAnalyzing}
                className="py-3 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 active:scale-95 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 fill-current text-white" />
                <span>Tap to Speak</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={handleCancelRecording}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition"
                title="Discard recording"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleSendVoiceMessage}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm shadow-xl transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>Send Voice Note & Analyze</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
