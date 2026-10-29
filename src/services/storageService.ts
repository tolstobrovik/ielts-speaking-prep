import { ExamSessionResult, UserPreferences } from '../types/ielts';

const EXAM_HISTORY_KEY = 'ielts_master_exam_history_v1';
const PREFERENCES_KEY = 'ielts_master_user_prefs_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  targetBand: 7.5,
  examinerVoice: {
    accent: 'en-GB',
    rate: 0.95,
    pitch: 1.0,
    examinerName: 'David (British Standard)'
  },
  geminiApiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || '',
  enableLiveTranscription: true,
  soundEffects: true,
  darkMode: false,
};

export class StorageService {
  public static getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(PREFERENCES_KEY);
      if (data) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load user preferences', e);
    }
    return DEFAULT_PREFERENCES;
  }

  public static savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save user preferences', e);
    }
  }

  public static getExamHistory(): ExamSessionResult[] {
    try {
      const data = localStorage.getItem(EXAM_HISTORY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load exam history', e);
    }
    return [];
  }

  public static saveExamResult(result: ExamSessionResult): void {
    try {
      const history = this.getExamHistory();
      // Keep most recent 50 tests
      const updated = [result, ...history.filter(h => h.id !== result.id)].slice(0, 50);
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save exam result', e);
    }
  }

  public static deleteExamResult(id: string): void {
    try {
      const history = this.getExamHistory();
      const updated = history.filter(h => h.id !== id);
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete exam result', e);
    }
  }

  public static clearAllHistory(): void {
    try {
      localStorage.removeItem(EXAM_HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear exam history', e);
    }
  }
}
