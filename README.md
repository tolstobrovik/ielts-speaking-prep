# 🎙️ IELTS MasterSpeak — AI Speaking Mock Examiner & Prep

**IELTS MasterSpeak** is a comprehensive, authentic IELTS Speaking preparation and diagnostic web application designed to help candidates prepare for and achieve **Band 7.0 to 9.0** in the Cambridge / British Council / IDP IELTS Speaking test.

---

## 🌟 Key Features

### 🎓 1. Official Full Mock Exam Simulation (11–14 Mins)
- **Part 1 (Familiar Interview):** 3–4 warm-up questions with examiner audio speech, real-time microphone recording, and live transcription.
- **Part 2 (Individual Long Turn / Cue Card):**
  - Official **60-second preparation countdown timer** with pacing warnings.
  - Digital **Candidate Scratchpad** to jot down bullet points and strategy cues (Who, When, Where, Why, Feelings, Idioms).
  - **2-Minute Speaking Stopwatch** with visual color zones:
    - *0:00–1:00 (Amber):* Under minimum threshold warning.
    - *1:00–1:45 (Green):* Ideal Band 7–9 speaking length.
    - *1:45–2:00 (Blue):* Final conclusion window.
    - *2:00+ (Red):* Examiner politely interrupts.
- **Part 3 (Two-way Discussion):** Abstract, societal-level questions expanding on the Part 2 theme with PEEL method tips.
- **Composite Test Report Form (TRF):** Full band score certificate, 4-pillar breakdown, audio replay, and targeted action plan.

### 🎯 2. Focused Part Drills
- Drill Part 1, Part 2, or Part 3 independently across authentic themes:
  - *Artificial Intelligence & Future Tech*
  - *Environmental Stewardship & Sustainable Tourism*
  - *Career Ambitions & Modern Education*
  - *Culture, Heritage & Globalization*
- Instant evaluation, transcription inspection, and Band 8.5 model answers for every question.

### 🤖 3. Intelligent IELTS 4-Pillar Scoring Engine
Scores candidate speech accurately against official Cambridge assessment criteria:
1. **Fluency & Coherence (FC):** Speaking rate (WPM), hesitation ratio, and discourse marker density.
2. **Lexical Resource (LR):** Vocabulary diversity (Type-Token Ratio), collocations, native idioms, and flags for repetitive Band 5 words.
3. **Grammatical Range & Accuracy (GRA):** Complex sentence structures, relative clauses, conditionals (2nd/3rd), passive voice, and tense consistency.
4. **Pronunciation & Delivery (P):** Natural conversational pacing, rhythm, and clarity.
- **Dual AI Mode:** Works 100% offline with built-in analytical NLP scoring, or with an optional Gemini 2.5 Flash API Key for deep conversational AI critique and Band 9 sentence rewrites!

### 📚 4. Band 8–9 Lexical Vault
- Curated bank of native idioms, academic collocations, and discourse signposts.
- Filterable by topic and category.
- "Band 5 vs Band 8" vocabulary upgrades (e.g. replacing elementary phrases with precise collocations).
- Built-in audio pronunciation for every term.

### 📊 5. Progress History & Audio Replays
- Saves past test attempts, transcripts, and audio recordings in LocalStorage.
- Replay your spoken responses to evaluate your own cadence and pronunciation.

---

## 🚀 Running the App Locally

The application is already running in your development environment!

```bash
cd "C:\Users\omono\.gemini\antigravity\scratch\ielts-speaking-prep"
npm run dev
```

Open your browser at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Audio & Speech:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), Web Audio API (`AudioContext`, `AnalyserNode`), and MediaRecorder API.
- **Evaluation:** Built-in IELTS Cambridge rubric analytical engine + optional Google Gemini API.
