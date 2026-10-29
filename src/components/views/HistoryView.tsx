import React, { useState, useEffect } from 'react';
import { History, Trash2, Calendar, Award, Volume2, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { ExamSessionResult } from '../../types/ielts';
import { StorageService } from '../../services/storageService';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<ExamSessionResult[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamSessionResult | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const list = StorageService.getExamHistory();
    setHistory(list);
    if (list.length > 0 && !selectedExam) {
      setSelectedExam(list[0]);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this test record?')) {
      StorageService.deleteExamResult(id);
      loadHistory();
      if (selectedExam?.id === id) {
        setSelectedExam(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all historical test reports? This cannot be undone.')) {
      StorageService.clearAllHistory();
      setHistory([]);
      setSelectedExam(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Past Test History & Progress
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review previous mock tests, replay your voice recordings, and inspect criterion growth.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-xl mx-auto shadow-sm">
          <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            No Exam History Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Take your first Full Mock Exam or Part Drill. Your band scores, speech transcripts, and recorded answers will be saved here automatically!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left List of Exams */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Completed Exams ({history.length})
            </h4>

            {history.map((exam) => (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  selectedExam?.id === exam.id
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 shadow-md ring-2 ring-red-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exam.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 capitalize">
                      {exam.mode.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {exam.topicTheme}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {exam.responses.length} questions answered
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {exam.overallBand.toFixed(1)}
                  </div>
                  <button
                    onClick={(e) => handleDelete(exam.id, e)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Selected Exam Detailed TRF */}
          <div className="lg:col-span-8">
            {selectedExam ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-[11px] font-black uppercase tracking-wider">
                        Official Test Record
                      </span>
                      <span className="text-xs text-slate-400">{selectedExam.date}</span>
                    </div>
                    <h3 className="text-xl font-black">{selectedExam.topicTheme}</h3>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-700">
                    <span className="text-xs font-bold text-slate-300">Composite Band:</span>
                    <span className="text-3xl font-black text-red-400">
                      {selectedExam.overallBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* 4 Pillars Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-semibold block">Fluency (FC)</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedExam.scores.fc.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-semibold block">Lexical (LR)</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedExam.scores.lr.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-semibold block">Grammar (GRA)</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedExam.scores.gra.toFixed(1)}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-xs text-slate-400 font-semibold block">Pronunciation (P)</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedExam.scores.p.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Summary Feedback */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                    "{selectedExam.summaryVerdict}"
                  </div>

                  {/* Question Responses and Audio Replays */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recorded Spoken Answers ({selectedExam.responses.length})
                    </h4>

                    {selectedExam.responses.map((resp, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-red-600 dark:text-red-400">
                            Part {resp.part} Question {i + 1}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Band {resp.overallBand.toFixed(1)} • {resp.wordsPerMinute} WPM
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          "{resp.questionPrompt}"
                        </p>

                        {resp.audioBlobUrl && (
                          <div className="pt-1">
                            <audio controls src={resp.audioBlobUrl} className="h-8 w-full max-w-sm" />
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                          {resp.userTranscript}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-slate-400">
                Select an exam from the left to view the complete diagnostic report.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
