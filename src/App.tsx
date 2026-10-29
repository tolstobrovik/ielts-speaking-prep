import React, { useState, useEffect } from 'react';
import { UserPreferences } from './types/ielts';
import { StorageService } from './services/storageService';
import { Header, AppView } from './components/Header';
import { VoiceExaminerChatView } from './components/views/VoiceExaminerChatView';
import { MockExamView } from './components/views/MockExamView';
import { PartPracticeView } from './components/views/PartPracticeView';
import { LexicalVaultView } from './components/views/LexicalVaultView';
import { HistoryView } from './components/views/HistoryView';
import { RubricView } from './components/views/RubricView';
import { SettingsModal } from './components/SettingsModal';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { MessageSquare, Award, Mic, BookOpen, History } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [preferences, setPreferences] = useState<UserPreferences>(StorageService.getPreferences());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  useEffect(() => {
    // Synchronize dark mode class with root html element
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const handleToggleTheme = () => {
    const updated = { ...preferences, darkMode: !preferences.darkMode };
    setPreferences(updated);
    StorageService.savePreferences(updated);
  };

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    StorageService.savePreferences(newPrefs);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        preferences={preferences}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
      />

      {/* Main Content Area (with safe bottom padding for mobile navigation bar) */}
      <main className="flex-1 pb-24 md:pb-12">
        {currentView === 'chat' && (
          <VoiceExaminerChatView
            preferences={preferences}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentView === 'mock' && (
          <MockExamView
            preferences={preferences}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentView === 'drill' && (
          <PartPracticeView
            preferences={preferences}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentView === 'vault' && (
          <LexicalVaultView preferences={preferences} />
        )}

        {currentView === 'rubric' && (
          <RubricView />
        )}

        {currentView === 'history' && (
          <HistoryView />
        )}
      </main>

      {/* Native Mobile Bottom Navigation Bar (Optimized for Redmi Note 13 & Android 13) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,8px)] pt-1.5 px-2 shadow-2xl">
        <div className="flex items-center justify-around">
          {[
            { key: 'chat', label: 'Voice AI', icon: MessageSquare },
            { key: 'mock', label: 'Full Mock', icon: Award },
            { key: 'drill', label: 'Part Drills', icon: Mic },
            { key: 'vault', label: 'Vocabulary', icon: BookOpen },
            { key: 'history', label: 'History', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as AppView)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <div className={`p-1 rounded-xl transition ${isActive ? 'bg-red-50 dark:bg-red-950/60' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={handleSavePreferences}
      />

      {/* Phone Setup & QR Modal */}
      <PhoneConnectModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      {/* Footer (Desktop only) */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">IELTS MasterSpeak AI</span>
            <span>•</span>
            <span>Mobile-First Progressive Web App for Redmi Note 13</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            IELTS® is a registered trademark of Cambridge University, British Council, and IDP Education.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
