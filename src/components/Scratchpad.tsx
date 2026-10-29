import React from 'react';
import { Edit3, Check, Trash2, Lightbulb } from 'lucide-react';

interface ScratchpadProps {
  notes: string;
  onChange: (notes: string) => void;
  subPrompts?: string[];
}

export const Scratchpad: React.FC<ScratchpadProps> = ({
  notes,
  onChange,
  subPrompts = []
}) => {
  const insertTemplateItem = (cue: string) => {
    const addition = notes ? `\n• ${cue}: ` : `• ${cue}: `;
    onChange(notes + addition);
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 shadow-md relative">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-amber-800/40 mb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Candidate Scratchpad (1-Minute Prep Notes)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400">
            Pencil & paper simulation
          </span>
          {notes && (
            <button
              onClick={() => onChange('')}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 p-1"
              title="Clear notes"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick cue tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs text-amber-800/70 dark:text-amber-300 font-medium self-center mr-1">
          Quick Starters:
        </span>
        {['Who / What', 'When / Where', 'Why it matters', 'Key feeling', 'Idiom to use'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => insertTemplateItem(tag)}
            className="text-[11px] px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/60 transition font-medium border border-amber-300/40"
          >
            + {tag}
          </button>
        ))}
      </div>

      {/* Textarea for note taking */}
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type brief bullet points or keywords here to guide your 2-minute speech... (e.g. • My grandfather • Carpentry • Resilience • 'Through thick and thin')"
        className="w-full h-32 p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-amber-200 dark:border-amber-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none"
      />

      <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span><strong>Examiner Tip:</strong> Write single words or abbreviations, not full sentences, so you maintain natural eye contact!</span>
      </div>
    </div>
  );
};
