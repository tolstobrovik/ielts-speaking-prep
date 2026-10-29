import { CoachingFeedback, IELTSPart, HowToSayItBetter, VocabularyBoostItem, GrammarSlipItem, FillerWordStats } from '../types/ielts';
import { LEXICAL_VAULT } from '../data/lexicalVault';

const COMMON_FILLERS = [
  { term: 'um', key: 'umCount' },
  { term: 'uh', key: 'uhCount' },
  { term: 'like', key: 'likeCount' },
  { term: 'you know', key: 'youKnowCount' },
  { term: 'basically', key: 'total' },
  { term: 'actually', key: 'total' },
  { term: 'sort of', key: 'total' },
  { term: 'kind of', key: 'total' }
];

export class AICoachingService {
  /**
   * Primary entry point for voice message analysis.
   * Seamlessly uses Gemini API if available, or rich local NLP engine.
   */
  public static async analyzeVoiceMessage(
    transcript: string,
    questionPrompt: string,
    part: IELTSPart,
    durationSeconds: number,
    topic: string,
    apiKey?: string
  ): Promise<CoachingFeedback> {
    let storedKey: string | undefined;
    try {
      const rawPrefs = typeof localStorage !== 'undefined' ? localStorage.getItem('ielts_user_preferences') : null;
      if (rawPrefs) {
        storedKey = JSON.parse(rawPrefs).geminiApiKey;
      }
    } catch {}

    const effectiveKey = apiKey?.trim() || storedKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as any).__GEMINI_KEY__ : undefined);

    // Try server API first if running with server backend
    try {
      const serverResponse = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          questionPrompt,
          part,
          durationSeconds,
          topic,
          apiKey: effectiveKey
        })
      });

      if (serverResponse.ok) {
        const data = await serverResponse.json();
        return data;
      }
    } catch (e) {
      // Local fallback if API route is not reached
    }

    // If client has effective Gemini API key, try direct client-side call
    if (effectiveKey) {
      try {
        const geminiResult = await this.callGeminiDirect(transcript, questionPrompt, part, durationSeconds, topic, effectiveKey);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini direct call failed, falling back to local NLP engine:', err);
      }
    }

    // Default: High-performance Instant Local NLP Evaluation Engine
    return this.generateLocalFeedback(transcript, questionPrompt, part, durationSeconds, topic);
  }

  private static async callGeminiDirect(
    transcript: string,
    questionPrompt: string,
    part: IELTSPart,
    durationSeconds: number,
    topic: string,
    apiKey: string
  ): Promise<CoachingFeedback | null> {
    const prompt = `You are an elite Cambridge IELTS Senior Examiner providing instant speech coaching on a candidate's voice response.
Exam Part: Part ${part}
Question Asked: "${questionPrompt}"
Candidate's Spoken Transcript: "${transcript}"
Duration: ${durationSeconds} seconds
Topic: ${topic}

You are a world-class Cambridge IELTS Senior Speaking Examiner and coach (trained on 9.0 mock examiners like Asilbek Yusupov and Eric Boyd).
Evaluate with surgical precision against the 4 official criteria: FC, LR, GRA, and P.
In "howToSayItBetter", elevate candidate speech into authentic Band 9 standard with spontaneous discourse markers ("Off the top of my head", "It really boils down to", "Be that as it may"), native idioms, and advanced syntactic clauses (inverted conditionals, cleft sentences, passive voice).

Analyze the response thoroughly and return ONLY a valid JSON object with NO MARKDOWN formatting:
{
  "overallBand": 7.5,
  "scores": {
    "fc": 7.5,
    "lr": 8.0,
    "gra": 7.0,
    "p": 7.5
  },
  "summaryVerdict": "Sharp 1-2 sentence examiner diagnostic assessment.",
  "howToSayItBetter": [
    {
      "originalSentence": "exact sentence from candidate transcript",
      "band85Rewrite": "the same thought elevated to authentic Band 9 Cambridge/IELTS ZONE standard",
      "explanation": "grammatical and lexical breakdown"
    }
  ],
  "vocabularyBoost": [
    {
      "original": "simple word used",
      "upgrade": "Band 9 collocation or native idiom",
      "reason": "precise academic register"
    }
  ],
  "grammarSlips": [
    {
      "mistake": "specific slip if any",
      "correction": "correct form",
      "rule": "explanation of grammar rule"
    }
  ],
  "fillerWordStats": {
    "umCount": 0,
    "uhCount": 0,
    "likeCount": 0,
    "youKnowCount": 0,
    "total": 0,
    "pacingAdvice": "Pacing recommendation regarding speech pauses."
  },
  "examinerDirectTip": "One actionable, high-impact coaching tip.",
  "examinerFollowUp": "An incisive, natural follow-up question to test candidate depth."
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    let parsed: any;
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      }
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('Failed to parse Gemini direct response, using fallback:', parseErr);
      return null;
    }

    const words = transcript.trim().split(/\s+/).length;
    const wpm = Math.round(words / Math.max(durationSeconds / 60, 0.1));

    return {
      overallBand: typeof parsed.overallBand === 'number' ? parsed.overallBand : 7.0,
      scores: {
        fc: parsed.scores?.fc || 7.0,
        lr: parsed.scores?.lr || 7.0,
        gra: parsed.scores?.gra || 7.0,
        p: parsed.scores?.p || 7.0
      },
      summaryVerdict: parsed.summaryVerdict || "Spoken response delivered with good communicative intent.",
      howToSayItBetter: Array.isArray(parsed.howToSayItBetter) && parsed.howToSayItBetter.length > 0
        ? parsed.howToSayItBetter
        : [{
            originalSentence: transcript.slice(0, 80),
            band85Rewrite: "Without question, " + transcript,
            explanation: "Enhanced using native discourse markers and collocations."
          }],
      vocabularyBoost: Array.isArray(parsed.vocabularyBoost) ? parsed.vocabularyBoost : [],
      grammarSlips: Array.isArray(parsed.grammarSlips) ? parsed.grammarSlips : [],
      fillerWordStats: parsed.fillerWordStats || {
        umCount: 0, uhCount: 0, likeCount: 0, youKnowCount: 0, total: 0,
        pacingAdvice: "Pacing was natural."
      },
      examinerDirectTip: parsed.examinerDirectTip || "Use varied sentence starters to sustain discourse.",
      examinerFollowUp: parsed.examinerFollowUp || "How do you think this will change in the near future?",
      wpm,
      wordCount: words,
      isAiPowered: true
    };
  }

  public static generateLocalFeedback(
    transcript: string,
    questionPrompt: string,
    part: IELTSPart,
    durationSeconds: number,
    topic: string
  ): CoachingFeedback {
    const cleanText = transcript.trim();
    const words = cleanText.length > 0 ? cleanText.split(/\s+/) : [];
    const wordCount = words.length;
    const minutes = Math.max(durationSeconds / 60, 0.1);
    const wpm = Math.round(wordCount / minutes);
    const lowerText = cleanText.toLowerCase();

    // 1. Analyze Fillers
    let umCount = 0;
    let uhCount = 0;
    let likeCount = 0;
    let youKnowCount = 0;
    let totalFillers = 0;

    COMMON_FILLERS.forEach(f => {
      const regex = new RegExp(`\\b${f.term}\\b`, 'gi');
      const matches = cleanText.match(regex);
      const count = matches ? matches.length : 0;
      if (f.term === 'um') umCount = count;
      else if (f.term === 'uh') uhCount = count;
      else if (f.term === 'like') likeCount = count;
      else if (f.term === 'you know') youKnowCount = count;
      totalFillers += count;
    });

    // 2. Score Band Criteria
    let fc = 6.5;
    let lr = 6.5;
    let gra = 6.5;
    let p = 6.5;

    // Fluency & Coherence adjustments
    if (wpm >= 115 && wpm <= 155) fc += 0.5;
    else if (wpm < 85) fc -= 0.5;

    if (totalFillers <= 1 && wordCount >= 30) fc += 0.5;
    else if (totalFillers > 4) fc -= 0.5;

    // Lexical adjustments
    const advancedVocabMatches = LEXICAL_VAULT.filter(item =>
      lowerText.includes(item.term.toLowerCase())
    );

    if (advancedVocabMatches.length >= 2) lr += 1.0;
    else if (advancedVocabMatches.length === 1) lr += 0.5;

    // Grammar adjustments
    if (/\b(if|provided that|unless|had I|although|whereas|despite|not only)\b/i.test(cleanText)) {
      gra += 0.5;
    }
    if (/\b(is|are|was|were)\s+\w+ed\b/i.test(cleanText)) {
      gra += 0.5;
    }

    // Pronunciation heuristics
    if (wpm >= 105 && wpm <= 145) p += 0.5;

    const roundHalf = (v: number) => Math.min(9.0, Math.max(4.5, Math.round(v * 2) / 2));
    fc = roundHalf(fc);
    lr = roundHalf(lr);
    gra = roundHalf(gra);
    p = roundHalf(p);

    const overallBand = roundHalf((fc + lr + gra + p) / 4);

    // 3. Generate "How to Say It Better" (Before vs After)
    const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    const howToSayItBetter: HowToSayItBetter[] = [];

    if (sentences.length > 0) {
      const sentenceToUpgrade = sentences[0];
      // Generate intelligent contextual rewrite
      let rewritten = sentenceToUpgrade;

      if (/I think/i.test(rewritten)) {
        rewritten = rewritten.replace(/I think/i, "From my perspective, I firmly contend that");
      } else if (/I like/i.test(rewritten)) {
        rewritten = rewritten.replace(/I like/i, "I have always possessed a deep penchant for");
      } else {
        rewritten = `Without question, ${rewritten.charAt(0).toLowerCase() + rewritten.slice(1)}, which has proven to be an invaluable asset.`;
      }

      rewritten = rewritten
        .replace(/\bvery good\b/gi, 'exceptionally advantageous')
        .replace(/\ba lot of\b/gi, 'a substantial multitude of')
        .replace(/\bhard\b/gi, 'considerably arduous')
        .replace(/\bbig\b/gi, 'profound')
        .replace(/\bimportant\b/gi, 'paramount');

      howToSayItBetter.push({
        originalSentence: sentenceToUpgrade,
        band85Rewrite: rewritten,
        explanation: "Replaced colloquial phrasing with academic register, introduced an emphatic discourse signpost, and upgraded adjectives."
      });
    } else {
      howToSayItBetter.push({
        originalSentence: "I use technology all the time because it is good.",
        band85Rewrite: "I rely on state-of-the-art technological tools practically without interruption, predominantly because they streamline my workflow.",
        explanation: "Elevated elementary phrasing to Band 8.5 using collocations ('state-of-the-art') and precision verbs ('streamline')."
      });
    }

    // 4. Vocabulary Boosters
    const vocabularyBoost: VocabularyBoostItem[] = [];
    if (lowerText.includes('good') || lowerText.includes('nice')) {
      vocabularyBoost.push({
        original: 'good / nice',
        upgrade: 'invaluable / exceptional',
        reason: 'Adds precision and avoids Band 5 overused adjectives.'
      });
    }
    if (lowerText.includes('a lot') || lowerText.includes('many')) {
      vocabularyBoost.push({
        original: 'a lot of',
        upgrade: 'a multitude of / an abundance of',
        reason: 'Demonstrates lexical flexibility.'
      });
    }
    if (lowerText.includes('important')) {
      vocabularyBoost.push({
        original: 'important',
        upgrade: 'of paramount importance',
        reason: 'Formal idiomatic construction that signals Band 8+ register.'
      });
    }
    if (vocabularyBoost.length === 0) {
      vocabularyBoost.push(
        {
          original: 'everyday words',
          upgrade: 'second nature / double-edged sword',
          reason: 'Native idiomatic expressions immediately elevate your Lexical Resource.'
        },
        {
          original: 'I think',
          upgrade: 'I am inclined to believe that',
          reason: 'Provides a sophisticated discourse starter.'
        }
      );
    }

    // 5. Grammar Slips
    const grammarSlips: GrammarSlipItem[] = [];
    if (/\bI am agree\b/i.test(cleanText)) {
      grammarSlips.push({
        mistake: 'I am agree',
        correction: 'I agree / I completely concur',
        rule: "'Agree' is a main verb, not an adjective. Do not use 'am' before it."
      });
    }
    if (/\bmore better\b/i.test(cleanText)) {
      grammarSlips.push({
        mistake: 'more better',
        correction: 'substantially better',
        rule: "'Better' is already a comparative. Use adverbs like 'far' or 'significantly'."
      });
    }
    if (grammarSlips.length === 0) {
      grammarSlips.push({
        mistake: 'Sentence connectors',
        correction: 'Try adding concessive clauses like "Although X, Y is nevertheless true."',
        rule: 'Band 7+ requires complex subordinate clauses to sustain argumentation.'
      });
    }

    // 6. Direct Examiner Tip & Follow-up Question
    let directTip = "Maintain a steady speech rate of 120-140 WPM and replace simple adjectives with topic-specific collocations.";
    if (totalFillers >= 3) {
      directTip = `You used ${totalFillers} filler words ("um", "like"). Pause silently to collect your thoughts instead of vocalizing fillers.`;
    } else if (wpm < 95) {
      directTip = "Elaborate each answer using the PEEL technique: Point, Explanation, Example, and Link.";
    }

    const followUpQuestionsByTopic: Record<string, string[]> = {
      default: [
        "That's an intriguing point. How do you foresee this trend evolving over the coming decade?",
        "Could you expand on the broader societal implications of what you just mentioned?",
        "Some critics might argue the exact opposite. How would you respond to their perspective?",
        "To what extent do you think generational differences influence this attitude?"
      ]
    };

    const followUps = followUpQuestionsByTopic.default;
    const examinerFollowUp = followUps[Math.floor(Math.random() * followUps.length)];

    const summaryVerdict = overallBand >= 7.5
      ? `Impressive spoken response. Your answer demonstrated strong lexical agility and smooth communicative flow.`
      : overallBand >= 6.5
      ? `Solid response with clear meaning. Upgrading your vocabulary collocations and linking sentences will push you directly to Band 7.5+.`
      : `Good effort. Focus on speaking in longer thought chunks and reducing hesitation fillers.`;

    const pacingAdvice = totalFillers <= 1
      ? "Excellent acoustic poise with minimal filler sounds."
      : `Detected ${totalFillers} hesitation markers. Embrace deliberate 1-second silent pauses instead of 'um' or 'like'.`;

    return {
      overallBand,
      scores: { fc, lr, gra, p },
      summaryVerdict,
      howToSayItBetter,
      vocabularyBoost,
      grammarSlips,
      fillerWordStats: {
        umCount,
        uhCount,
        likeCount,
        youKnowCount,
        total: totalFillers,
        pacingAdvice
      },
      examinerDirectTip: directTip,
      examinerFollowUp,
      wpm,
      wordCount,
      isAiPowered: false
    };
  }
}
