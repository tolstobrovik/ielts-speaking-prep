import React, { useState } from 'react';
import { X, Volume2, Key, Award, Check, Sparkles, Sliders, Shield } from 'lucide-react';
import { UserPreferences, ExaminerVoiceConfig } from '../types/ielts';
import { speechService } from '../services/speechService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences
}) => {
  const [targetBand, setTargetBand] = useState(preferences.targetBand);
  const [accent, setAccent] = useState(preferences.examinerVoice.accent);
  const [examinerName, setExaminerName] = useState(preferences.examinerVoice.examinerName);
  const [rate, setRate] = useState(preferences.examinerVoice.rate);
  const [apiKey, setApiKey] = useState(preferences.geminiApiKey || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const voicePresets = [
    { name: 'David (British RP)', accent: 'en-GB' as const },
    { name: 'Sarah (British Modern)', accent: 'en-GB' as const },
    { name: 'Michael (North American)', accent: 'en-US' as const },
    { name: 'Emma (Australian)', accent: 'en-AU' as const },
  ];

  const handleTestVoice = () => {
    speechService.speakText("Good morning. Could you tell me your full name, please? Let us begin Part 1 of the speaking test.", {
      accent,
      rate
    });
  };

  const handleSave = () => {
    const updated: UserPreferences = {
      ...preferences,
      targetBand,
      examinerVoice: {
        accent,
        rate,
        pitch: 1.0,
        examinerName
      },
      geminiApiKey: apiKey.trim() || undefined
    };
    onSavePreferences(updated);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Exam & Examiner Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize examiner voice, target band score, and AI grading.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target Band Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Your Target IELTS Band Score:
            </label>
            <div className="flex items-center gap-2">
              {[6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setTargetBand(b)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition ${
                    targetBand === b
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {b.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Examiner Voice & Accent */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Examiner Persona & Accent:
              </label>
              <button
                type="button"
                onClick={handleTestVoice}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Test Voice
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {voicePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setExaminerName(preset.name);
                    setAccent(preset.accent);
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition ${
                    examinerName === preset.name
                      ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">{preset.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{preset.accent}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Examiner Pacing Speed</span>
              <span>{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Slow & Deliberate (0.75x)</span>
              <span>Official Standard (0.95x)</span>
              <span>Fast (1.25x)</span>
            </div>
          </div>

          {/* Optional Gemini API Key */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Optional Gemini 2.5 Flash API Key
              </label>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              The app works 100% out of the box with built-in Cambridge scoring heuristics. Enter your Gemini API key to enable live, conversational LLM critique and customized Band 9 rewrites!
            </p>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use smart offline scoring)"
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> Key is stored strictly in your browser's LocalStorage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
