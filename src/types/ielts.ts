export type IELTSPart = 1 | 2 | 3;

export interface IELTSQuestion {
  id: string;
  part: IELTSPart;
  topic: string;
  prompt: string;
  subPrompts?: string[]; // Specifically for Part 2 cue card bullet points
  followUpQuestions?: string[]; // Specifically for Part 3 or follow-up
  modelAnswerBand8: string;
  keyVocabulary: string[];
  idiomaticExpressions: string[];
  discourseMarkers: string[];
  tips: string;
}

export interface IELTSExamTopicSet {
  id: string;
  theme: string;
  title: string;
  difficulty: 'Standard' | 'Challenging' | 'High Frequency';
  part1Questions: IELTSQuestion[];
  part2CueCard: IELTSQuestion;
  part3Questions: IELTSQuestion[];
}

export interface CriterionFeedback {
  criterion: 'Fluency & Coherence' | 'Lexical Resource' | 'Grammatical Range & Accuracy' | 'Pronunciation';
  code: 'FC' | 'LR' | 'GRA' | 'P';
  score: number;
  strengths: string[];
  improvements: string[];
  observedFeatures: string[];
}

export interface QuestionResponseRecord {
  questionId: string;
  questionPrompt: string;
  part: IELTSPart;
  userTranscript: string;
  audioDurationSeconds: number;
  audioBlobUrl?: string;
  wordsPerMinute: number;
  wordCount: number;
  detectedVocabulary: string[];
  grammarNotes: string[];
  criterionScores: {
    fc: number;
    lr: number;
    gra: number;
    p: number;
  };
  overallBand: number;
  aiFeedbackSummary: string;
  modelAnswer: string;
}

export interface ExamSessionResult {
  id: string;
  date: string;
  mode: 'full_mock' | 'part_drill' | 'quick_practice';
  topicTheme: string;
  responses: QuestionResponseRecord[];
  overallBand: number;
  scores: {
    fc: number;
    lr: number;
    gra: number;
    p: number;
  };
  summaryVerdict: string;
  actionPlan: string[];
  examinerNotes: string;
}

export interface ExaminerVoiceConfig {
  accent: 'en-GB' | 'en-US' | 'en-AU' | 'en-CA';
  rate: number;
  pitch: number;
  examinerName: string;
}

export interface UserPreferences {
  targetBand: number; // e.g. 7.5
  examinerVoice: ExaminerVoiceConfig;
  geminiApiKey?: string;
  enableLiveTranscription: boolean;
  soundEffects: boolean;
  darkMode: boolean;
}

export interface HowToSayItBetter {
  originalSentence: string;
  band85Rewrite: string;
  explanation: string;
}

export interface VocabularyBoostItem {
  original: string;
  upgrade: string;
  reason: string;
}

export interface GrammarSlipItem {
  mistake: string;
  correction: string;
  rule: string;
}

export interface FillerWordStats {
  umCount: number;
  uhCount: number;
  likeCount: number;
  youKnowCount: number;
  total: number;
  pacingAdvice: string;
}

export interface CoachingFeedback {
  overallBand: number;
  scores: {
    fc: number;
    lr: number;
    gra: number;
    p: number;
  };
  summaryVerdict: string;
  howToSayItBetter: HowToSayItBetter[];
  vocabularyBoost: VocabularyBoostItem[];
  grammarSlips: GrammarSlipItem[];
  fillerWordStats: FillerWordStats;
  examinerDirectTip: string;
  examinerFollowUp: string;
  wpm: number;
  wordCount: number;
  isAiPowered: boolean;
}

export interface VoiceChatMessage {
  id: string;
  sender: 'examiner' | 'candidate';
  timestamp: string;
  text: string;
  audioBlobUrl?: string;
  audioDurationSeconds?: number;
  feedback?: CoachingFeedback;
  topic?: string;
  part?: IELTSPart;
}

