import React from 'react';
import { Timer, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface TimerDisplayProps {
  mode: 'countdown' | 'countup';
  seconds: number;
  totalDuration?: number; // e.g. 60s for prep, 120s for Part 2 speaking
  isPart2Speaking?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  seconds,
  totalDuration = 60,
  isPart2Speaking = false
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  if (mode === 'countdown') {
    const progressPercent = Math.max(0, Math.min(100, (seconds / totalDuration) * 100));
    const isUrgent = seconds <= 10;

    return (
      <div className="flex flex-col items-center p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Preparation Time Remaining
        </div>

        {/* Big countdown numbers */}
        <div className={`text-4xl font-black font-mono tracking-tight transition-colors ${isUrgent ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
          {formatTime(seconds)}
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-2 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-amber-400'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-2 text-center">
          {isUrgent ? '⚠️ Final seconds! Get ready to begin speaking.' : 'Use your scratchpad below to jot 4-5 bullet points.'}
        </p>
      </div>
    );
  }

  // Countup mode (for speaking responses)
  if (isPart2Speaking) {
    let statusColor = 'text-amber-400';
    let statusBg = 'bg-amber-500/10 border-amber-500/30';
    let statusText = 'Keep speaking: Under 1 min limit';
    let icon = <AlertCircle className="w-4 h-4 text-amber-400" />;

    if (seconds >= 60 && seconds < 105) {
      statusColor = 'text-emerald-400';
      statusBg = 'bg-emerald-500/10 border-emerald-500/30';
      statusText = 'Ideal speaking duration (Band 7-9 zone)';
      icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    } else if (seconds >= 105 && seconds < 120) {
      statusColor = 'text-blue-400';
      statusBg = 'bg-blue-500/10 border-blue-500/30';
      statusText = 'Examiner limit approaching: conclude your story';
      icon = <Clock className="w-4 h-4 text-blue-400" />;
    } else if (seconds >= 120) {
      statusColor = 'text-rose-400';
      statusBg = 'bg-rose-500/10 border-rose-500/30';
      statusText = '2 minutes reached: Examiner interrupts politely';
      icon = <AlertCircle className="w-4 h-4 text-rose-400" />;
    }

    const progressPercent = Math.min(100, (seconds / 120) * 100);

    return (
      <div className="flex flex-col items-center p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <Timer className="w-3.5 h-3.5 text-blue-400" />
          Part 2 Speaking Stopwatch (Max 2:00)
        </div>

        <div className={`text-4xl font-black font-mono tracking-tight ${statusColor}`}>
          {formatTime(seconds)}
        </div>

        {/* Pacing progress bar */}
        <div className="w-56 h-2.5 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700/60 relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              seconds >= 120 ? 'bg-rose-500' : seconds >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
          {/* Target marker at 1:00 */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40" title="1-minute mark" />
        </div>

        {/* Guidance pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium mt-2.5 ${statusBg} ${statusColor}`}>
          {icon}
          <span>{statusText}</span>
        </div>
      </div>
    );
  }

  // Standard Part 1 / Part 3 response timer
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 text-slate-300">
      <Timer className="w-4 h-4 text-blue-400" />
      <span className="text-xs font-medium text-slate-400">Response Duration:</span>
      <span className="font-mono font-bold text-white text-sm">{formatTime(seconds)}</span>
    </div>
  );
};
