export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private isRecording: boolean = false;
  private animFrameId: number | null = null;
  private activeMimeType: string = 'audio/webm';

  public async startRecording(onVisualizerData?: (data: number[]) => void): Promise<boolean> {
    try {
      this.audioChunks = [];

      // Tactile haptic feedback on Android (Redmi Note 13 MIUI)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(30); } catch (e) {}
      }

      // Request microphone stream with mobile-optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.audioStream = stream;

      // Setup Web Audio analyser with mobile touch resume handling
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume().catch(() => {});
        }

        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(new ArrayBuffer(bufferLength));

        if (onVisualizerData) {
          const updateData = () => {
            if (!this.isRecording || !this.analyser || !this.dataArray) return;
            this.analyser.getByteFrequencyData(this.dataArray);
            const normalized = Array.from(this.dataArray).map(v => v / 255);
            onVisualizerData(normalized);
            this.animFrameId = requestAnimationFrame(updateData);
          };
          this.animFrameId = requestAnimationFrame(updateData);
        }
      }

      // Detect best supported mime type for Android MIUI Chrome
      const candidateTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        ''
      ];
      this.activeMimeType = candidateTypes.find(t => !t || (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t))) || '';

      const options = this.activeMimeType ? { mimeType: this.activeMimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250);
      this.isRecording = true;
      return true;
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      return false;
    }
  }

  public stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve) => {
      this.isRecording = false;

      // Haptic confirmation on Android
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([40, 30, 40]); } catch (e) {}
      }

      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }

      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
        this.audioStream = null;
      }

      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }

      const mime = this.activeMimeType || 'audio/webm';

      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const fallbackBlob = new Blob(this.audioChunks, { type: mime });
        resolve({ blob: fallbackBlob, url: URL.createObjectURL(fallbackBlob) });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mime });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.mediaRecorder = null;
        resolve({ blob: audioBlob, url: audioUrl });
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}

export const audioRecorderService = new AudioRecorderService();
