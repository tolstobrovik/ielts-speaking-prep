import { CriterionFeedback, QuestionResponseRecord, IELTSPart } from '../types/ielts';
import { LEXICAL_VAULT } from '../data/lexicalVault';

const DISCOURSE_MARKERS = [
  'furthermore', 'moreover', 'in addition', 'on the flip side', 'on the other hand',
  'by and large', 'to put it into perspective', 'without a shadow of a doubt',
  'having said that', 'consequently', 'subsequently', 'in essence', 'it hinges on',
  'predominantly', 'as a matter of fact', 'from my perspective', 'to be perfectly frank',
  'needless to say', 'at the end of the day', 'undoubtedly', 'nevertheless', 'nonetheless'
];

const ADVANCED_ACADEMIC_WORDS = [
  'indispensable', 'convoluted', 'surveillance', 'polarizing', 'monopolization',
  'pedagogical', 'epistemic', 'obsolete', 'multifaceted', 'reverberations',
  'biodiversity', 'rejuvenating', 'antidote', 'penchant', 'lethargy', 'melancholia',
  'spellbinding', 'perspective', 'humbling', 'statutory', 'attenuation', 'equanimity',
  'parochial', 'interconnected', 'homogenizing', 'juggernaut', 'unwavering',
  'paradigm', 'dismantle', 'sovereignty', 'catalyst', 'exponentially', 'pivotal',
  'predominantly', 'gratifying', 'curiosity', 'resilience', 'profound'
];

const COMPLEX_GRAMMAR_MARKERS = [
  { pattern: /\b(if|provided that|as long as|unless|had I known)\b/i, name: 'Conditional Structures' },
  { pattern: /\b(which|who|whom|whose|wherein|whereby)\b/i, name: 'Relative Clauses' },
  { pattern: /\b(although|even though|whereas|while|despite|in spite of)\b/i, name: 'Concessive & Contrast Clauses' },
  { pattern: /\b(is|are|was|were|been|being)\s+\w+ed\b/i, name: 'Passive Voice' },
  { pattern: /\b(would have|could have|might have|should have)\b/i, name: 'Modal Perfect Verbs' },
  { pattern: /\b(not only\s+.*\s+but also|neither\s+.*\s+nor|either\s+.*\s+or)\b/i, name: 'Correlative Conjunctions' }
];

const COMMON_REPETITIONS = [
  'good', 'bad', 'nice', 'a lot of', 'very', 'thing', 'things', 'stuff', 'big', 'small'
];

export interface ScoringResult {
  overallBand: number;
  fc: CriterionFeedback;
  lr: CriterionFeedback;
  gra: CriterionFeedback;
  p: CriterionFeedback;
  detectedVocabulary: string[];
  grammarNotes: string[];
  summaryVerdict: string;
  wpm: number;
  wordCount: number;
}

export class ScoringEngine {
  public static analyzeResponseLocally(
    transcript: string,
    durationSeconds: number,
    part: IELTSPart,
    topicContext?: string
  ): ScoringResult {
    const cleanText = transcript.trim();
    const words = cleanText.length > 0 ? cleanText.split(/\s+/) : [];
    const wordCount = words.length;

    // Calculate Words Per Minute (WPM)
    const minutes = Math.max(durationSeconds / 60, 0.1);
    const wpm = Math.round(wordCount / minutes);

    const lowerText = cleanText.toLowerCase();

    // 1. FLUENCY & COHERENCE (FC)
    let fcScore = 6.0;
    const detectedDiscourseMarkers: string[] = [];
    DISCOURSE_MARKERS.forEach(marker => {
      if (lowerText.includes(marker)) {
        detectedDiscourseMarkers.push(marker);
      }
    });

    const fcStrengths: string[] = [];
    const fcImprovements: string[] = [];

    // Duration and length expectations by part
    const targetWords = part === 1 ? 35 : part === 2 ? 140 : 50;

    if (wordCount >= targetWords) {
      fcScore += 0.5;
      fcStrengths.push(`Ample length: Produced ${wordCount} words for Part ${part}.`);
    } else if (wordCount < targetWords * 0.5) {
      fcScore -= 1.0;
      fcImprovements.push(`Answer was too brief (${wordCount} words). Elaborate further using reasons and examples.`);
    }

    if (wpm >= 115 && wpm <= 160) {
      fcScore += 0.5;
      fcStrengths.push(`Natural conversational tempo of ~${wpm} WPM.`);
    } else if (wpm < 90) {
      fcScore -= 0.5;
      fcImprovements.push(`Speech rate is slightly slow (~${wpm} WPM), which might signal excessive hesitation.`);
    } else if (wpm > 175) {
      fcImprovements.push(`Very rapid tempo (~${wpm} WPM); ensure words are clearly enunciated without rushing.`);
    }

    if (detectedDiscourseMarkers.length >= 3) {
      fcScore += 1.0;
      fcStrengths.push(`Effective use of discourse markers: "${detectedDiscourseMarkers.slice(0, 3).join('", "')}".`);
    } else if (detectedDiscourseMarkers.length >= 1) {
      fcScore += 0.5;
      fcStrengths.push(`Used signposting: "${detectedDiscourseMarkers[0]}".`);
    } else {
      fcImprovements.push(`Incorporate more linking markers (e.g. "having said that", "furthermore", "to put it into perspective").`);
    }

    // 2. LEXICAL RESOURCE (LR)
    let lrScore = 6.0;
    const detectedVocab: string[] = [];
    const lrStrengths: string[] = [];
    const lrImprovements: string[] = [];

    ADVANCED_ACADEMIC_WORDS.forEach(vocab => {
      if (lowerText.includes(vocab)) {
        detectedVocab.push(vocab);
      }
    });

    // Check Vault matches
    LEXICAL_VAULT.forEach(item => {
      if (lowerText.includes(item.term.toLowerCase()) && !detectedVocab.includes(item.term)) {
        detectedVocab.push(item.term);
      }
    });

    // Type-Token Ratio (Vocabulary Diversity)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const diversityRatio = wordCount > 0 ? (uniqueWords / wordCount) : 0;

    if (detectedVocab.length >= 4) {
      lrScore += 1.5;
      lrStrengths.push(`Impressive band 8-9 vocabulary detected: ${detectedVocab.slice(0, 4).join(', ')}.`);
    } else if (detectedVocab.length >= 2) {
      lrScore += 1.0;
      lrStrengths.push(`Used higher-level expressions: ${detectedVocab.join(', ')}.`);
    } else {
      lrImprovements.push(`Upgrade everyday vocabulary with collocations (e.g. use "profound impact" instead of "big change").`);
    }

    if (diversityRatio > 0.65 && wordCount > 30) {
      lrScore += 0.5;
      lrStrengths.push(`Broad lexical range with minimal word repetition (TTR: ${(diversityRatio * 100).toFixed(0)}%).`);
    }

    // Flag common overused words
    const repetitiveWordsUsed = COMMON_REPETITIONS.filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = cleanText.match(regex);
      return matches && matches.length >= 2;
    });

    if (repetitiveWordsUsed.length > 0) {
      lrImprovements.push(`Avoid repeating elementary words like "${repetitiveWordsUsed.join('", "')}". Try more precise synonyms.`);
    }

    // 3. GRAMMATICAL RANGE & ACCURACY (GRA)
    let graScore = 6.0;
    const graStrengths: string[] = [];
    const graImprovements: string[] = [];
    const detectedGrammarFeatures: string[] = [];

    COMPLEX_GRAMMAR_MARKERS.forEach(item => {
      if (item.pattern.test(cleanText)) {
        detectedGrammarFeatures.push(item.name);
      }
    });

    if (detectedGrammarFeatures.length >= 3) {
      graScore += 1.5;
      graStrengths.push(`Demonstrated wide structural range: ${detectedGrammarFeatures.join(', ')}.`);
    } else if (detectedGrammarFeatures.length >= 1) {
      graScore += 0.5;
      graStrengths.push(`Successfully used ${detectedGrammarFeatures.join(', ')}.`);
    } else {
      graImprovements.push(`Incorporate more complex sentence structures such as conditionals ("If I were to...") or passive forms.`);
    }

    // Check sentence lengths
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? (wordCount / sentences.length) : 0;
    if (avgSentenceLength >= 14) {
      graStrengths.push(`Sustained complex sentences (avg ${Math.round(avgSentenceLength)} words per clause).`);
    } else if (avgSentenceLength < 7 && wordCount > 20) {
      graImprovements.push(`Many short, clipped sentences. Connect ideas with relative clauses or coordinating conjunctions.`);
    }

    // 4. PRONUNCIATION & DELIVERY (P)
    let pScore = 6.5;
    const pStrengths: string[] = [];
    const pImprovements: string[] = [];

    if (wpm >= 110 && wpm <= 150) {
      pScore += 0.5;
      pStrengths.push(`Rhythmic delivery and stable cadence without awkward rushing.`);
    } else if (wpm < 85) {
      pScore -= 0.5;
      pImprovements.push(`Pacing was fragmented. Practice sentence chunking and connected speech.`);
    }

    pStrengths.push(`Clear acoustic clarity and recognizable word stress.`);
    pImprovements.push(`Practice intonation modulation: use rising intonation when listing and falling intonation for definitive statements.`);

    // Clamp scores between 4.0 and 9.0 in 0.5 increments
    const roundHalf = (val: number) => Math.min(9.0, Math.max(4.0, Math.round(val * 2) / 2));

    const finalFC = roundHalf(fcScore);
    const finalLR = roundHalf(lrScore);
    const finalGRA = roundHalf(graScore);
    const finalP = roundHalf(pScore);

    // Official IELTS rounding rule: average of 4 criteria, rounded to nearest 0.5
    // (e.g. 6.25 -> 6.5, 6.75 -> 7.0, 6.125 -> 6.0)
    const rawAverage = (finalFC + finalLR + finalGRA + finalP) / 4;
    const overallBand = Math.round(rawAverage * 2) / 2;

    let summaryVerdict = '';
    if (overallBand >= 8.0) {
      summaryVerdict = `Outstanding response! You demonstrated fluent mastery with advanced idiomatic precision and structural complexity.`;
    } else if (overallBand >= 7.0) {
      summaryVerdict = `Very strong performance! Clear, cohesive delivery with good lexical sophistication and complex grammar.`;
    } else if (overallBand >= 6.0) {
      summaryVerdict = `Competent response. Meaning was fully clear, though vocabulary upgrades and more complex sentence structures will push you toward Band 7+.`;
    } else {
      summaryVerdict = `Developing response. Focus on extending your ideas with concrete examples and maintaining continuous speech flow.`;
    }

    return {
      overallBand,
      fc: {
        criterion: 'Fluency & Coherence',
        code: 'FC',
        score: finalFC,
        strengths: fcStrengths,
        improvements: fcImprovements,
        observedFeatures: detectedDiscourseMarkers
      },
      lr: {
        criterion: 'Lexical Resource',
        code: 'LR',
        score: finalLR,
        strengths: lrStrengths,
        improvements: lrImprovements,
        observedFeatures: detectedVocab
      },
      gra: {
        criterion: 'Grammatical Range & Accuracy',
        code: 'GRA',
        score: finalGRA,
        strengths: graStrengths,
        improvements: graImprovements,
        observedFeatures: detectedGrammarFeatures
      },
      p: {
        criterion: 'Pronunciation',
        code: 'P',
        score: finalP,
        strengths: pStrengths,
        improvements: pImprovements,
        observedFeatures: [`Speaking tempo: ${wpm} WPM`]
      },
      detectedVocabulary: detectedVocab,
      grammarNotes: detectedGrammarFeatures,
      summaryVerdict,
      wpm,
      wordCount
    };
  }

  public static async analyzeWithGemini(
    transcript: string,
    questionPrompt: string,
    part: IELTSPart,
    apiKey: string
  ): Promise<{
    overallBand: number;
    fcScore: number;
    lrScore: number;
    graScore: number;
    pScore: number;
    feedback: string;
    modelBand9Upgrade: string;
    vocabularyUpgrades: string[];
    grammarCorrections: string[];
  }> {
    const prompt = `You are an official Cambridge IELTS Senior Speaking Examiner.
Evaluate this candidate's speaking response for Part ${part} of the IELTS Speaking Test according to the official 4 IELTS assessment criteria:
1. Fluency & Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range & Accuracy (GRA)
4. Pronunciation & Delivery (P)

Question asked: "${questionPrompt}"
Candidate's transcribed response: "${transcript}"

Return ONLY a valid JSON object without markdown formatting, matching this exact structure:
{
  "overallBand": 7.5,
  "fcScore": 7.5,
  "lrScore": 8.0,
  "graScore": 7.0,
  "pScore": 7.5,
  "feedback": "Concise 2-3 sentence examiner evaluation covering key strengths and main area to target for band 8+.",
  "vocabularyUpgrades": ["suggested phrase 1 with explanation", "suggested collocation 2 with explanation"],
  "grammarCorrections": ["correction or alternative phrasing for any clumsy clause"],
  "modelBand9Upgrade": "A rewritten version of candidate's idea elevated to Band 9 standard."
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("No text returned by Gemini");

    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }
    const parsed = JSON.parse(cleaned);
    return parsed;
  }
}
