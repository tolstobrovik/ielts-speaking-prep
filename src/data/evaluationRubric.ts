export interface BandDescriptor {
  band: number;
  fluencyAndCoherence: string;
  lexicalResource: string;
  grammaticalRange: string;
  pronunciation: string;
}

export const OFFICIAL_BAND_DESCRIPTORS: BandDescriptor[] = [
  {
    band: 9,
    fluencyAndCoherence: "Speaks fluently with only rare repetition or self-correction; any hesitation is content-related rather than to find words. Speaks coherently with fully appropriate cohesive features. Develops topics fully and appropriately.",
    lexicalResource: "Uses vocabulary with full flexibility and precision in all topics. Uses idiomatic language naturally and accurately without hesitation.",
    grammaticalRange: "Uses a full range of structures naturally and appropriately. Produces consistently accurate structures apart from 'slips' characteristic of native speaker speech.",
    pronunciation: "Uses a full range of pronunciation features with precision and subtlety. Sustains flexible use of features throughout. Is effortless to understand."
  },
  {
    band: 8,
    fluencyAndCoherence: "Speaks fluently with only occasional repetition or self-correction; hesitation is usually content-based. Develops topics coherently and appropriately.",
    lexicalResource: "Uses a wide vocabulary resource readily and flexibly to convey precise meaning. Uses less common and idiomatic vocabulary skillfully, with occasional inaccuracies.",
    grammaticalRange: "Uses a wide range of structures flexibly. Produces a majority of error-free sentences with only very occasional inaccuracies or non-systematic errors.",
    pronunciation: "Uses a wide range of pronunciation features. Sustains flexible use of features, with only occasional lapses. Is easy to understand throughout; L1 accent has minimal effect."
  },
  {
    band: 7,
    fluencyAndCoherence: "Speaks at length without noticeable effort or loss of coherence. May demonstrate language-related hesitation at times, or some repetition and/or self-correction. Uses a range of connectives and discourse markers flexibly.",
    lexicalResource: "Uses vocabulary resource flexibly to discuss a variety of topics. Uses some less common and idiomatic vocabulary and shows some awareness of style and collocation, with some inappropriate choices.",
    grammaticalRange: "Uses a range of complex structures with some flexibility. Frequently produces error-free sentences, though some grammatical mistakes persist.",
    pronunciation: "Shows all the positive features of Band 6 and some, but not all, of the positive features of Band 8. Can generally be understood throughout."
  },
  {
    band: 6,
    fluencyAndCoherence: "Is willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation. Uses a range of connectives and discourse markers but not always appropriately.",
    lexicalResource: "Has a wide enough vocabulary to discuss topics at length and make meaning clear in spite of inaccuracies. Generally succeeds in paraphrasing.",
    grammaticalRange: "Uses a mix of simple and complex structures, but with limited flexibility. May make frequent mistakes with complex structures, though these rarely cause comprehension problems.",
    pronunciation: "Uses a range of pronunciation features with mixed control. Shows some effective use of features but this is not sustained. Can generally be understood throughout."
  },
  {
    band: 5,
    fluencyAndCoherence: "Usually maintains flow of speech but uses repetition, self-correction and/or slow speech to keep going. Over-uses certain connectives and discourse markers. Produces simple speech fluently, but more complex communication causes fluency problems.",
    lexicalResource: "Manages to talk about familiar and unfamiliar topics but uses vocabulary with limited flexibility. Attempts use of paraphrase but with mixed success.",
    grammaticalRange: "Produces basic sentence forms with reasonable accuracy. Uses a limited range of more complex structures, but these usually contain errors and may cause some comprehension problems.",
    pronunciation: "Shows all the positive features of Band 4 and some, but not all, of the positive features of Band 6. Frequent mispronunciations occur."
  }
];

export interface CriterionExplanation {
  name: string;
  code: string;
  weight: string;
  summary: string;
  keyFactors: string[];
}

export const CRITERIA_EXPLANATIONS: CriterionExplanation[] = [
  {
    name: "Fluency & Coherence",
    code: "FC",
    weight: "25%",
    summary: "Evaluates your ability to talk continuously without unnatural pauses or hesitation, and how logically your thoughts are connected.",
    keyFactors: [
      "Speech rate & tempo (120-150 words per minute is ideal)",
      "Smoothness and natural pauses (pausing for ideas, not searching for grammar)",
      "Appropriate use of discourse markers (e.g., 'To put it another way', 'Furthermore')",
      "Ability to extend answers with depth and examples (PEEL method)"
    ]
  },
  {
    name: "Lexical Resource",
    code: "LR",
    weight: "25%",
    summary: "Assesses the range and precision of your vocabulary, collocations, idiomatic phrasing, and ability to paraphrase without repeating words.",
    keyFactors: [
      "Range of topic-specific vocabulary (avoiding generic words like 'good', 'bad')",
      "Natural collocations (e.g., 'stiff competition', 'profound impact')",
      "Idiomatic and less common expressions used in context",
      "Accurate word choice and precise register (academic/formal for Part 3)"
    ]
  },
  {
    name: "Grammatical Range & Accuracy",
    code: "GRA",
    weight: "25%",
    summary: "Measures the variety and complexity of sentence structures and how consistently error-free your speaking is.",
    keyFactors: [
      "Mix of simple, compound, and complex sentence structures",
      "Use of subordinate clauses, conditionals (2nd/3rd conditional), and passive voice",
      "Subject-verb agreement and tense consistency (past, present perfect, modal verbs)",
      "High proportion of error-free sentences"
    ]
  },
  {
    name: "Pronunciation & Delivery",
    code: "P",
    weight: "25%",
    summary: "Considers how effortlessly the examiner can understand your speech, including intonation, word stress, rhythm, and sentence flow.",
    keyFactors: [
      "Individual sound clarity (consonant clusters and vowel lengths)",
      "Word and sentence stress (stressing key content words for emphasis)",
      "Intonation patterns (rising/falling pitch to signal questions and conclusions)",
      "Rhythm and chunking (linking words smoothly without robotic separation)"
    ]
  }
];
