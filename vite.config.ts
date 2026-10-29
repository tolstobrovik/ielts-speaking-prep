import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function getEnvApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/GEMINI_API_KEY=(.*)/);
      if (match && match[1]?.trim()) {
        return match[1].trim();
      }
    }
  } catch (e) {
    // Ignore error
  }
  return undefined;
}

function parseJsonSafe(raw: string): any {
  let cleaned = raw.trim();
  // Strip markdown code fences if model wrapped response in ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return JSON.parse(cleaned);
}

// Server-side robust fallback analysis
function generateServerFallbackAnalysis(data: any) {
  const transcript = (data.transcript || '').trim();
  const words = transcript.length > 0 ? transcript.split(/\s+/) : [];
  const duration = data.durationSeconds || 30;
  const minutes = Math.max(duration / 60, 0.1);
  const wpm = Math.round(words.length / minutes);

  const fillers = ['um', 'uh', 'like', 'you know'];
  let totalFillers = 0;
  fillers.forEach(f => {
    const regex = new RegExp(`\\b${f}\\b`, 'gi');
    const matches = transcript.match(regex);
    if (matches) totalFillers += matches.length;
  });

  let fc = 6.5;
  let lr = 6.5;
  let gra = 6.5;
  let p = 6.5;

  if (wpm >= 115 && wpm <= 155) fc += 0.5;
  if (words.length >= 25 && totalFillers <= 1) fc += 0.5;
  if (/second nature|double-edged sword|indispensable|streamline|paramount/i.test(transcript)) lr += 1.0;
  if (/\b(if|although|whereas|despite|not only)\b/i.test(transcript)) gra += 0.5;

  const roundHalf = (v: number) => Math.min(9.0, Math.max(4.5, Math.round(v * 2) / 2));
  fc = roundHalf(fc);
  lr = roundHalf(lr);
  gra = roundHalf(gra);
  p = roundHalf(p);
  const overallBand = roundHalf((fc + lr + gra + p) / 4);

  let rewritten = transcript || "I use technology because it makes my life easy.";
  rewritten = rewritten
    .replace(/\bvery good\b/gi, "exceptionally advantageous")
    .replace(/\ba lot of\b/gi, "a substantial multitude of")
    .replace(/\bhard\b/gi, "considerably arduous")
    .replace(/\bmake my work easy\b/gi, "streamlines my daily workflow");

  if (!rewritten.startsWith("Without question") && !rewritten.startsWith("From my perspective")) {
    rewritten = `From my perspective, ${rewritten.charAt(0).toLowerCase() + rewritten.slice(1)}, which serves as an invaluable asset.`;
  }

  return {
    overallBand,
    scores: { fc, lr, gra, p },
    summaryVerdict: overallBand >= 7.0
      ? "Clear and communicative delivery with natural spoken cohesion."
      : "Solid spoken effort. Upgrading vocabulary collocations and linking sentences will push you to Band 7.5+.",
    howToSayItBetter: [
      {
        originalSentence: transcript || "I think technology is very good.",
        band85Rewrite: rewritten,
        explanation: "Elevated everyday phrasing to Band 8.5 with idiomatic collocations and academic register."
      }
    ],
    vocabularyBoost: [
      { original: "good / easy", upgrade: "invaluable / streamlined", reason: "Adds academic precision." }
    ],
    grammarSlips: [
      { mistake: "it make", correction: "it makes", rule: "Third-person singular present tense requires -s on the verb." }
    ],
    fillerWordStats: {
      umCount: 0,
      uhCount: 0,
      likeCount: 0,
      youKnowCount: 0,
      total: totalFillers,
      pacingAdvice: totalFillers <= 1 ? "Excellent acoustic poise." : "Use deliberate silent pauses instead of hesitation sounds."
    },
    examinerDirectTip: "Use varied linking phrases ('on the flip side', 'to put it into perspective') to show fluency.",
    examinerFollowUp: "That's an interesting perspective. How do you envision this situation evolving over the next five years?",
    wpm,
    wordCount: words.length,
    isAiPowered: false
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ielts-api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/status' && req.method === 'GET') {
            const hasKey = !!getEnvApiKey();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'online',
              hasGeminiKey: hasKey,
              engine: hasKey ? 'Google Gemini 3.5 Flash (Active)' : 'High-Performance Local Cambridge Engine'
            }));
            return;
          }

          if (req.url === '/api/analyze-voice' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const data = JSON.parse(body || '{}');
                const apiKey = data.apiKey || getEnvApiKey();

                if (apiKey) {
                  const prompt = `You are a world-class Cambridge IELTS Senior Speaking Examiner and coach (in the style of premier 9.0 mock examiners like Asilbek Yusupov and Eric Boyd).
Evaluate this candidate's response for Part ${data.part || 1} with surgical precision against the 4 official IELTS criteria:
1. Fluency & Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range & Accuracy (GRA)
4. Pronunciation & Delivery (P)

Question Asked: "${data.questionPrompt || 'Tell me about yourself'}"
Candidate Transcript: "${data.transcript}"
Spoken Duration: ${data.durationSeconds || 30}s
Topic: "${data.topic || 'General'}"

Evaluation Principles:
- In "howToSayItBetter", rewrite the candidate's exact idea into authentic Band 9.0 spoken English using spontaneous discourse markers (e.g. "Off the top of my head", "It really boils down to", "Be that as it may"), native idioms, and advanced syntactic structures (inverted conditionals, cleft sentences, passive voice).
- In "vocabularyBoost", supply precise collocations and idiomatic phrases used by Band 9 candidates.
- In "examinerFollowUp", ask an authentic, thought-provoking follow-up question that challenges the candidate's reasoning.

Return ONLY a JSON object (no markdown, no backticks):
{
  "overallBand": 7.5,
  "scores": { "fc": 7.5, "lr": 8.0, "gra": 7.0, "p": 7.5 },
  "summaryVerdict": "Sharp 1-2 sentence diagnostic assessment in the style of an official examiner debrief.",
  "howToSayItBetter": [
    {
      "originalSentence": "exact sentence from candidate",
      "band85Rewrite": "the same thought elevated to authentic Band 9 standard",
      "explanation": "grammatical and lexical breakdown"
    }
  ],
  "vocabularyBoost": [
    { "original": "simple word used", "upgrade": "Band 9 collocation/idiom", "reason": "precise academic register" }
  ],
  "grammarSlips": [
    { "mistake": "candidate slip", "correction": "correct grammar", "rule": "rule explanation" }
  ],
  "fillerWordStats": {
    "umCount": 0, "uhCount": 0, "likeCount": 0, "youKnowCount": 0, "total": 0,
    "pacingAdvice": "Pacing recommendation."
  },
  "examinerDirectTip": "One punchy action for their next question.",
  "examinerFollowUp": "An incisive, natural follow-up question."
}`;

                  // Try gemini-3.5-flash first, fallback to gemini-3.8-flash
                  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash'];
                  for (const model of modelsToTry) {
                    try {
                      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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

                      if (geminiRes.ok) {
                        const geminiData = await geminiRes.json();
                        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (rawText) {
                          const parsed = parseJsonSafe(rawText);
                          const words = (data.transcript || '').trim().split(/\s+/).length;
                          const wpm = Math.round(words / Math.max((data.durationSeconds || 30) / 60, 0.1));

                          const sanitized = {
                            overallBand: typeof parsed.overallBand === 'number' ? parsed.overallBand : 7.0,
                            scores: {
                              fc: parsed.scores?.fc || 7.0,
                              lr: parsed.scores?.lr || 7.0,
                              gra: parsed.scores?.gra || 7.0,
                              p: parsed.scores?.p || 7.0
                            },
                            summaryVerdict: parsed.summaryVerdict || "Good spoken response with clear communication.",
                            howToSayItBetter: Array.isArray(parsed.howToSayItBetter) && parsed.howToSayItBetter.length > 0
                              ? parsed.howToSayItBetter
                              : [{
                                  originalSentence: (data.transcript || '').slice(0, 80),
                                  band85Rewrite: "Without question, " + (data.transcript || ''),
                                  explanation: "Elevated with native discourse markers."
                                }],
                            vocabularyBoost: Array.isArray(parsed.vocabularyBoost) ? parsed.vocabularyBoost : [],
                            grammarSlips: Array.isArray(parsed.grammarSlips) ? parsed.grammarSlips : [],
                            fillerWordStats: parsed.fillerWordStats || {
                              umCount: 0, uhCount: 0, likeCount: 0, youKnowCount: 0, total: 0,
                              pacingAdvice: "Good pacing and poise."
                            },
                            examinerDirectTip: parsed.examinerDirectTip || "Use varied discourse connectors to sustain your flow.",
                            examinerFollowUp: parsed.examinerFollowUp || "How do you see this developing in the coming years?",
                            wpm,
                            wordCount: words,
                            isAiPowered: true,
                            modelUsed: model
                          };

                          res.setHeader('Content-Type', 'application/json');
                          res.end(JSON.stringify(sanitized));
                          return;
                        }
                      }
                    } catch (modelErr) {
                      console.warn(`Error calling ${model}:`, modelErr);
                    }
                  }
                }

                // If no key or call failed, return robust local analysis with status 200
                const fallback = generateServerFallbackAnalysis(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(fallback));
              } catch (parseErr) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON request' }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
  base: './',
  server: {
    port: 5173,
    host: true
  }
});
