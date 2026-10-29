import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Sparkles, Mic } from 'lucide-react';

interface ExaminerAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  examinerName: string;
  accent: string;
  onReplayQuestion?: () => void;
  statusText?: string;
}

export const ExaminerAvatar: React.FC<ExaminerAvatarProps> = ({
  isSpeaking,
  isListening,
  examinerName,
  accent,
  onReplayQuestion,
  statusText
}) => {
  const getAccentLabel = (code: string) => {
    switch (code) {
      case 'en-GB': return 'British RP';
      case 'en-US': return 'North American';
      case 'en-AU': return 'Australian';
      case 'en-CA': return 'Canadian';
      default: return 'British Accent';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
      {/* Background ambient glow when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl pointer-events-none animate-pulse" />
      )}
      {isListening && (
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Official IELTS Examiner Badge */}
      <div className="flex items-center gap-2 mb-4 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-medium tracking-wide">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="font-bold text-red-400">IELTS</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Certified Examiner
        </span>
      </div>

      {/* Avatar Circle with Audio Waves */}
      <div className="relative mb-4">
        {/* Ripple rings when speaking */}
        {isSpeaking && (
          <>
            <span className="absolute -inset-3 rounded-full border border-blue-400/40 animate-ping pointer-events-none" />
            <span className="absolute -inset-6 rounded-full border border-blue-500/20 animate-pulse pointer-events-none" />
          </>
        )}

        <div className={`w-28 h-28 rounded-full border-4 ${isSpeaking ? 'border-blue-400 glow-speaking' : isListening ? 'border-emerald-400 ring-4 ring-emerald-500/20' : 'border-slate-600'} overflow-hidden relative shadow-2xl transition-all duration-300 bg-slate-800 flex items-center justify-center`}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="IELTS Examiner"
            className="w-full h-full object-cover"
          />

          {/* Sound waves overlay when speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] flex items-center justify-center gap-1.5">
              <span className="w-1.5 bg-blue-300 rounded-full animate-soundwave-1" />
              <span className="w-1.5 bg-white rounded-full animate-soundwave-2" />
              <span className="w-1.5 bg-blue-400 rounded-full animate-soundwave-3" />
              <span className="w-1.5 bg-white rounded-full animate-soundwave-4" />
            </div>
          )}
        </div>

        {/* Live Mic status badge */}
        <div className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 border-slate-900 shadow-lg ${isListening ? 'bg-emerald-500 text-white animate-bounce' : isSpeaking ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
          {isListening ? (
            <Mic className="w-4 h-4" />
          ) : isSpeaking ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Examiner Metadata */}
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        {examinerName}
      </h3>
      <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-400" />
        {getAccentLabel(accent)} • British Council Standard
      </p>

      {/* Dynamic Status Notification */}
      <div className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
        isSpeaking
          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          : isListening
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          : 'bg-slate-800 text-slate-400 border border-slate-700'
      }`}>
        {statusText || (isSpeaking ? 'Examiner is speaking...' : isListening ? 'Listening to your response...' : 'Ready for test')}
      </div>

      {/* Action controls */}
      {onReplayQuestion && (
        <button
          onClick={onReplayQuestion}
          disabled={isSpeaking}
          className="mt-4 flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition shadow-sm"
          title="Repeat examiner question with speech synthesis"
        >
          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          Replay Question Voice
        </button>
      )}
    </div>
  );
};
