// Web Speech API interfaces
interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private onTranscriptUpdateCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindowSpeech;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-GB'; // Default to British English for IELTS standard

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptChunk + ' ';
            } else {
              interimTranscript += transcriptChunk;
            }
          }

          if (this.onTranscriptUpdateCallback) {
            const textToDeliver = (finalTranscript + interimTranscript).trim();
            this.onTranscriptUpdateCallback(textToDeliver, !!finalTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
        };

        this.recognition.onend = () => {
          // If stopped intentionally, do not restart
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch (err) {
              // Ignore restart error
            }
          }
        };
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    onUpdate: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. You can type or paste your response.');
      return false;
    }

    this.onTranscriptUpdateCallback = onUpdate;
    this.onErrorCallback = onError || null;
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      return false;
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
    }
  }

  public speakText(
    text: string,
    options: {
      accent?: 'en-GB' | 'en-US' | 'en-AU' | 'en-CA';
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ): void {
    if (!this.synthesis) {
      if (options.onStart) options.onStart();
      if (options.onEnd) setTimeout(options.onEnd, 1000);
      return;
    }

    this.synthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.95; // Slightly measured examiner pace
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.accent || 'en-GB';

    // Find best matching voice
    const voices = this.synthesis.getVoices();
    const targetLang = (options.accent || 'en-GB').toLowerCase();
    
    // Look for UK or English voices
    const preferredVoice = voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').includes(targetLang) &&
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('Arthur'))
    ) || voices.find(v => v.lang.toLowerCase().replace('_', '-').includes(targetLang))
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options.onStart) {
      utterance.onstart = options.onStart;
    }
    if (options.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }

    this.synthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices().filter(v => v.lang.startsWith('en'));
  }
}

export const speechService = new SpeechService();
