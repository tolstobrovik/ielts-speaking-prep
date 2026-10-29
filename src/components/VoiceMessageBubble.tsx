import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, ChevronDown, ChevronUp, Award, ArrowRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { VoiceChatMessage } from '../types/ielts';
import { speechService } from '../services/speechService';

interface VoiceMessageBubbleProps {
  message: VoiceChatMessage;
  examinerAccent?: string;
  onPlayModelAudio?: (text: string) => void;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  message,
  examinerAccent = 'en-GB',
  onPlayModelAudio
}) => {
  const isCandidate = message.sender === 'candidate';
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(true);
  const [isModelAudioPlaying, setIsModelAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const feedback = message.feedback;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleModelAudioPlay = (text: string) => {
    if (onPlayModelAudio) {
      onPlayModelAudio(text);
      return;
    }
    setIsModelAudioPlaying(true);
    speechService.speakText(text, {
      accent: examinerAccent as any,
      rate: 0.95,
      onStart: () => setIsModelAudioPlaying(true),
      onEnd: () => setIsModelAudioPlaying(false)
    });
  };

  const formatSecs = (secs?: number) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getBandBadgeClass = (band: number) => {
    if (band >= 8.0) return 'bg-emerald-600 text-white';
    if (band >= 7.0) return 'bg-blue-600 text-white';
    if (band >= 6.0) return 'bg-amber-600 text-white';
    return 'bg-rose-600 text-white';
  };

  // EXAMINER MESSAGE BUBBLE
  if (!isCandidate) {
    return (
      <div className="flex items-start gap-3 my-4 max-w-2xl animate-fadeIn">
        {/* Examiner Avatar Thumbnail */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0 mt-1">
          IELTS
        </div>

        <div className="flex-1 space-y-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl rounded-tl-sm p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                Official IELTS Examiner
              </span>
              <span className="text-[11px] text-slate-400">
                {message.timestamp}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {message.text}
            </p>

            {/* Quick listen button */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                onClick={() => handleModelAudioPlay(message.text)}
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-bold transition"
              >
                <Volume2 className="w-4 h-4 text-red-500" />
                Listen to Examiner Voice
              </button>

              {message.topic && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                  {message.topic}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE VOICE MESSAGE BUBBLE
  return (
    <div className="flex flex-col items-end my-4 max-w-2xl ml-auto animate-fadeIn space-y-2">
      {/* Voice Bubble Card */}
      <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-3xl rounded-tr-sm p-4 sm:p-5 shadow-lg w-full max-w-xl">
        <div className="flex items-center justify-between gap-3 mb-2 text-xs text-rose-100">
          <span className="font-bold flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            Your Spoken Voice Message
          </span>
          <span className="text-[11px] opacity-80">{message.timestamp}</span>
        </div>

        {/* Audio Player Bar */}
        {message.audioBlobUrl && (
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-2.5 rounded-2xl mb-3 border border-white/10">
            <button
              onClick={togglePlayAudio}
              className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Pseudo Audio Waveform Bars */}
            <div className="flex-1 flex items-center gap-1 h-6 px-1">
              {[40, 70, 90, 60, 30, 85, 100, 75, 45, 90, 65, 80, 50, 95, 70, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-white transition-opacity ${isPlaying ? 'opacity-90 animate-pulse' : 'opacity-40'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Speed toggle */}
            <button
              onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1)}
              className="px-2 py-1 rounded-lg bg-white/20 text-white text-[11px] font-bold hover:bg-white/30 transition"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>

            <span className="text-xs font-mono font-medium text-white/90">
              {formatSecs(message.audioDurationSeconds)}
            </span>

            <audio
              ref={audioRef}
              src={message.audioBlobUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {/* Speech Transcript */}
        <p className="text-sm leading-relaxed text-white/95 font-medium">
          "{message.text}"
        </p>

        {/* Diagnostic Band Score Pill */}
        {feedback && (
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-100 font-semibold">Diagnostic:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white text-slate-900 font-black text-xs shadow-sm">
                Band {feedback.overallBand.toFixed(1)}
              </span>
              <span className="text-[11px] text-rose-100">
                • {feedback.wpm} WPM
              </span>
            </div>

            <button
              onClick={() => setShowFeedbackDetails(!showFeedbackDetails)}
              className="flex items-center gap-1 text-xs text-white hover:text-rose-100 font-bold"
            >
              {showFeedbackDetails ? 'Hide Analysis' : 'View Coaching Feedback'}
              {showFeedbackDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* EXPANDABLE AI COACHING CARD */}
      {feedback && showFeedbackDetails && (
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-4 text-left transition-all">
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Examiner Coaching
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900/60">
                ⚡ Powered by Gemini 3.5 Flash
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${getBandBadgeClass(feedback.overallBand)}`}>
              Band {feedback.overallBand.toFixed(1)}
            </span>
          </div>

          {/* 1. "HOW TO SAY IT BETTER" (Before vs. Band 8.5 After) */}
          {feedback.howToSayItBetter && feedback.howToSayItBetter.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> How to Say It Better (Band 8.5 Upgrade)
                </span>
                <button
                  onClick={() => handleModelAudioPlay(feedback.howToSayItBetter[0].band85Rewrite)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md transition"
                  title="Listen to native pronunciation"
                >
                  <Volume2 className="w-3 h-3" />
                  Listen to Native Audio
                </button>
              </div>

              {/* Before & After comparison */}
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-500 dark:text-slate-400 line-through italic">
                  "{feedback.howToSayItBetter[0].originalSentence}"
                </div>
                <div className="text-emerald-700 dark:text-emerald-300 font-bold text-sm bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                  ✨ "{feedback.howToSayItBetter[0].band85Rewrite}"
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300">
                  <strong>Why this scores higher:</strong> {feedback.howToSayItBetter[0].explanation}
                </div>
              </div>
            </div>
          )}

          {/* 2. DIRECT COACHING TIP */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-100">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Examiner's One-Sentence Action:</strong> {feedback.examinerDirectTip}
            </div>
          </div>

          {/* 3. 4-PILLAR MINI BREAKDOWN */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">Fluency</span>
              <span className="font-bold text-slate-900 dark:text-white">{feedback.scores.fc.toFixed(1)}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">Lexical</span>
              <span className="font-bold text-slate-900 dark:text-white">{feedback.scores.lr.toFixed(1)}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">Grammar</span>
              <span className="font-bold text-slate-900 dark:text-white">{feedback.scores.gra.toFixed(1)}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">Pronunc.</span>
              <span className="font-bold text-slate-900 dark:text-white">{feedback.scores.p.toFixed(1)}</span>
            </div>
          </div>

          {/* 4. FILLER WORDS & VOCABULARY BOOST PILLS */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
            <div className="text-slate-500">
              <span>Hesitation Fillers: </span>
              <strong className={feedback.fillerWordStats.total > 2 ? 'text-amber-500' : 'text-emerald-500'}>
                {feedback.fillerWordStats.total} detected
              </strong>
            </div>

            {feedback.vocabularyBoost && feedback.vocabularyBoost.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400">Boosters:</span>
                {feedback.vocabularyBoost.slice(0, 2).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800"
                    title={item.reason}
                  >
                    ★ {item.upgrade}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
