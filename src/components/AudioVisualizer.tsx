import React from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  frequencyData?: number[];
  color?: 'emerald' | 'rose' | 'blue';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  frequencyData = [],
  color = 'rose'
}) => {
  // If no dynamic Web Audio FFT data supplied, generate pleasant animated fallback bars
  const barCount = 24;

  const getColorClasses = (index: number) => {
    if (color === 'emerald') return 'bg-emerald-500 shadow-emerald-500/50';
    if (color === 'blue') return 'bg-blue-500 shadow-blue-500/50';
    return 'bg-rose-500 shadow-rose-500/50';
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-14 px-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80">
      {Array.from({ length: barCount }).map((_, i) => {
        let heightPercent = 12;

        if (isRecording) {
          if (frequencyData && frequencyData.length > 0) {
            const dataIdx = Math.floor((i / barCount) * frequencyData.length);
            const val = frequencyData[dataIdx] || 0.1;
            heightPercent = Math.max(12, Math.min(100, Math.round(val * 100)));
          } else {
            // Simulated rhythmic sound wave
            const wave = Math.sin((i / barCount) * Math.PI) * 70;
            const variance = ((i % 3) + 1) * 10;
            heightPercent = Math.max(15, Math.min(95, Math.round(wave + variance)));
          }
        }

        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-75 ${getColorClasses(i)} ${isRecording ? 'opacity-90 shadow-sm' : 'opacity-25'}`}
            style={{
              height: `${isRecording ? heightPercent : 15}%`,
              transitionDuration: isRecording ? '80ms' : '300ms'
            }}
          />
        );
      })}
    </div>
  );
};
