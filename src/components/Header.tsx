import React from 'react';
import { Award, Mic, BookOpen, History, Settings, Sun, Moon, Sparkles, MessageSquare, SlidersHorizontal, BookCheck, Smartphone } from 'lucide-react';
import { UserPreferences } from '../types/ielts';

export type AppView = 'chat' | 'mock' | 'drill' | 'vault' | 'history' | 'rubric';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  preferences: UserPreferences;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  onOpenPhoneModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  preferences,
  onOpenSettings,
  onToggleTheme,
  onOpenPhoneModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => onSelectView('chat')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  IELTS <span className="text-red-600">MasterSpeak</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  AI Examiner
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Voice Message Examiner & Instant Cambridge Diagnostic
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => onSelectView('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentView === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-500" />
              Voice Examiner
            </button>

            <button
              onClick={() => onSelectView('mock')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentView === 'mock'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Full Mock Exam
            </button>

            <button
              onClick={() => onSelectView('drill')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentView === 'drill'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Part Drills
            </button>

            <button
              onClick={() => onSelectView('vault')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentView === 'vault'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lexical Vault
            </button>

            <button
              onClick={() => onSelectView('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentView === 'history'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Past Tests
            </button>
          </nav>

          {/* Controls & Target Band */}
          <div className="flex items-center gap-2.5">
            {/* Target Band Pill */}
            <div
              onClick={onOpenSettings}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 hover:border-red-300 transition"
              title="Click to adjust your target band"
            >
              <span className="text-[11px] font-bold text-red-700 dark:text-red-300">Target</span>
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">
                {preferences.targetBand.toFixed(1)}
              </span>
            </div>

            {/* AI Engine Status Pill */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
              title="Examiner Voice & AI Grading Configuration"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">
                {preferences.geminiApiKey ? 'Gemini 2.5 Active' : 'Zero-Setup AI Ready'}
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
            </button>

            {/* Redmi Note 13 Phone Mode Button */}
            {onOpenPhoneModal && (
              <button
                onClick={onOpenPhoneModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-xs font-bold shadow-sm transition"
                title="Connect Redmi Note 13 via QR code"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Redmi Note 13</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              aria-label="Toggle dark mode"
            >
              {preferences.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-200 dark:border-slate-800">
          {[
            { key: 'chat', label: '🎙️ Voice Chat' },
            { key: 'mock', label: '🎓 Mock Exam' },
            { key: 'drill', label: '🎯 Drills' },
            { key: 'vault', label: '📚 Vocabulary' },
            { key: 'history', label: '📊 Past Tests' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onSelectView(item.key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentView === item.key
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
