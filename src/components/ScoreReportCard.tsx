import React, { useState } from 'react';
import { Award, Volume2, CheckCircle2, AlertTriangle, Sparkles, BookOpen, ArrowRight, RotateCcw, Share2, Layers, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScoringResult } from '../services/scoringEngine';
import { IELTSQuestion } from '../types/ielts';

interface ScoreReportCardProps {
  scoring: ScoringResult;
  question: IELTSQuestion;
  userTranscript: string;
  audioBlobUrl?: string;
  targetBand: number;
  onRetake: () => void;
  onNext?: () => void;
  isFullExamFinal?: boolean;
}

export const ScoreReportCard: React.FC<ScoreReportCardProps> = ({
  scoring,
  question,
  userTranscript,
  audioBlobUrl,
  targetBand,
  onRetake,
  onNext,
  isFullExamFinal = false
}) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'vocabulary' | 'modelAnswer' | 'transcript'>('criteria');
  const [copied, setCopied] = useState(false);

  // Trigger celebration if Band >= 7.0
  React.useEffect(() => {
    if (scoring.overallBand >= 7.0) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore
      }
    }
  }, [scoring.overallBand]);

  const getBandBadgeColor = (band: number) => {
    if (band >= 8.0) return 'bg-emerald-600 text-white border-emerald-400';
    if (band >= 7.0) return 'bg-blue-600 text-white border-blue-400';
    if (band >= 6.0) return 'bg-amber-600 text-white border-amber-400';
    return 'bg-rose-600 text-white border-rose-400';
  };

  const handleShare = () => {
    const text = `I scored Band ${scoring.overallBand.toFixed(1)} on my IELTS Speaking practice (${question.topic}) using IELTS MasterSpeak!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const criteria = [
    { name: 'Fluency & Coherence', code: 'FC', data: scoring.fc, desc: 'Pacing, discourse markers, lack of unnatural hesitation' },
    { name: 'Lexical Resource', code: 'LR', data: scoring.lr, desc: 'Idiomatic expressions, precision, collocations & diversity' },
    { name: 'Grammatical Range & Accuracy', code: 'GRA', data: scoring.gra, desc: 'Complex clauses, conditionals, tense consistency' },
    { name: 'Pronunciation & Delivery', code: 'P', data: scoring.p, desc: 'Rhythm, natural word stress and clear articulation' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto my-6 transition-all">
      {/* Official TRF Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <Award className="w-64 h-64 -mr-16" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-widest uppercase">
                Official IELTS Assessment Format
              </span>
              <span className="text-xs text-rose-100 font-medium">
                Part {question.part} Diagnostic
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Test Report Form & Examiner Analysis
            </h2>
            <p className="text-sm text-rose-100/90 mt-0.5 max-w-xl">
              Topic: <span className="font-semibold text-white">{question.topic}</span>
            </p>
          </div>

          {/* Big Band Score Stamp */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-[11px] font-bold tracking-wider text-rose-200 uppercase">
                Estimated Band
              </div>
              <div className="text-xs text-rose-100">
                Target: Band {targetBand.toFixed(1)}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white">
              {scoring.overallBand.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Playback & Quick Stats Toolbar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          {audioBlobUrl && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Your Recording:</span>
              <audio controls src={audioBlobUrl} className="h-8 max-w-xs" />
            </div>
          )}
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
            <span><strong>Tempo:</strong> {scoring.wpm} words/min</span>
            <span>•</span>
            <span><strong>Word Count:</strong> {scoring.wordCount} words</span>
            <span>•</span>
            <span><strong>Target Delta:</strong> {scoring.overallBand >= targetBand ? <span className="text-emerald-500 font-bold">Goal Met (+{(scoring.overallBand - targetBand).toFixed(1)})</span> : <span className="text-amber-500 font-bold">{(scoring.overallBand - targetBand).toFixed(1)}</span>}</span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard!' : 'Share Result'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/50">
        {[
          { key: 'criteria', label: '4-Pillar Rubric Breakdown', icon: Layers },
          { key: 'vocabulary', label: 'Lexical Upgrades & Idioms', icon: Sparkles },
          { key: 'modelAnswer', label: 'Band 8.5 Model Answer', icon: BookOpen },
          { key: 'transcript', label: 'Transcribed Speech', icon: Volume2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-800/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: 4 CRITERIA */}
        {activeTab === 'criteria' && (
          <div className="space-y-6">
            {/* Examiner Verdict Quote */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" /> Official Examiner Diagnostic Verdict
              </h4>
              <p className="text-sm text-blue-950 dark:text-blue-100 font-medium italic">
                "{scoring.summaryVerdict}"
              </p>
            </div>

            {/* Grid of the 4 Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteria.map((c) => (
                <div
                  key={c.code}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                        {c.name}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                          {c.code}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.desc}
                      </p>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl font-black text-sm border ${getBandBadgeColor(c.data.score)}`}>
                      Band {c.data.score.toFixed(1)}
                    </div>
                  </div>

                  {/* Progress Gauge */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${
                        c.data.score >= 8.0 ? 'bg-emerald-500' : c.data.score >= 7.0 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${(c.data.score / 9.0) * 100}%` }}
                    />
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="space-y-2 text-xs">
                    {c.data.strengths.slice(0, 2).map((st, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </div>
                    ))}
                    {c.data.improvements.slice(0, 2).map((imp, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VOCABULARY UPGRADES */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Band 8-9 Lexical Recommendations for this Topic
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Incorporate these collocations and idiomatic phrases to push your Lexical Resource criterion past Band 7.5.
              </p>
            </div>

            {/* Key Vocabulary Pills */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Academic Collocations
              </h5>
              <div className="flex flex-wrap gap-2">
                {question.keyVocabulary.map((vocab, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold"
                  >
                    ★ {vocab}
                  </span>
                ))}
              </div>
            </div>

            {/* Idioms */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Natural Idiomatic Expressions
              </h5>
              <div className="flex flex-wrap gap-2">
                {question.idiomaticExpressions.map((idiom, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                  >
                    💡 {idiom}
                  </span>
                ))}
              </div>
            </div>

            {/* Discourse Markers */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                High-Scoring Signposting & Discourse Markers
              </h5>
              <div className="flex flex-wrap gap-2">
                {question.discourseMarkers.map((marker, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold"
                  >
                    🔗 {marker}
                  </span>
                ))}
              </div>
            </div>

            {/* Examiner Secret Tip */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
              <div>
                <strong>Official Examiner Note:</strong> {question.tips}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MODEL ANSWER */}
        {activeTab === 'modelAnswer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cambridge Band 8.5/9.0 Benchmark Response
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notice the seamless discourse flow, idiomatic agility, and varied syntactic structures.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                Band 9 Standard
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-serif">
              {question.modelAnswerBand8}
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <strong>Study Tip:</strong> Read this model answer aloud to attune your tongue to natural connected speech, rhythm, and intonation pauses!
            </div>
          </div>
        )}

        {/* TAB 4: TRANSCRIPT */}
        {activeTab === 'transcript' && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Your Transcribed Response
            </h4>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-mono">
              {userTranscript || "(No speech transcript detected. Ensure microphone was enabled during the test.)"}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition"
        >
          <RotateCcw className="w-4 h-4" />
          Retake This Question
        </button>

        {onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md transition"
          >
            {isFullExamFinal ? 'Complete Full Exam Session' : 'Continue to Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
