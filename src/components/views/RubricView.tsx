import React, { useState } from 'react';
import { BookCheck, Award, CheckCircle2, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { OFFICIAL_BAND_DESCRIPTORS, CRITERIA_EXPLANATIONS } from '../../data/evaluationRubric';

export const RubricView: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<number>(8);

  const descriptor = OFFICIAL_BAND_DESCRIPTORS.find(d => d.band === selectedBand) || OFFICIAL_BAND_DESCRIPTORS[1];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <BookCheck className="w-3.5 h-3.5" />
          Official Assessment Framework
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Cambridge IELTS Speaking Band Descriptors
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          The exact public rubric used by certified examiners worldwide to assess candidate performance across the 4 core pillars.
        </p>
      </div>

      {/* The 4 Assessment Pillars Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CRITERIA_EXPLANATIONS.map((c) => (
          <div
            key={c.code}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-xs font-mono">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-slate-400">{c.weight} Weight</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                {c.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Key Factors:
              </span>
              {c.keyFactors.slice(0, 2).map((kf, i) => (
                <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{kf}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Band Level Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Band-by-Band Descriptor Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click a band level to inspect examiner criteria benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[9, 8, 7, 6, 5].map((band) => (
              <button
                key={band}
                onClick={() => setSelectedBand(band)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  selectedBand === band
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Band {band}.0
              </button>
            ))}
          </div>
        </div>

        {/* Selected Band Criteria Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* FC */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              Fluency & Coherence
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {descriptor.fluencyAndCoherence}
            </p>
          </div>

          {/* LR */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              Lexical Resource
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {descriptor.lexicalResource}
            </p>
          </div>

          {/* GRA */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
              <BookCheck className="w-4 h-4" />
              Grammatical Range & Accuracy
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {descriptor.grammaticalRange}
            </p>
          </div>

          {/* P */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              Pronunciation
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {descriptor.pronunciation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
