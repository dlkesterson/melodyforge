export class AudioEngine {
  private audioContext: AudioContext;
  private audioWorklet: AudioWorkletNode | null = null;
  private gainNode: GainNode;
  private distortionNode: WaveShaperNode;
  private delayNode: DelayNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.distortionNode = this.audioContext.createWaveShaper();
    this.delayNode = this.audioContext.createDelay(1);

    this.setupAudioGraph();
    this.loadAudioWorklet();
  }

  private async loadAudioWorklet() {
    await this.audioContext.audioWorklet.addModule('src/audio-worklet-processor.js');
    this.audioWorklet = new AudioWorkletNode(this.audioContext, 'synth-processor');
    this.audioWorklet.connect(this.gainNode);
  }

  private setupAudioGraph() {
    this.gainNode.connect(this.distortionNode);
    this.distortionNode.connect(this.delayNode);
    this.delayNode.connect(this.audioContext.destination);
  }

  setVoice(voice: string) {
    if (this.audioWorklet) {
      this.audioWorklet.port.postMessage({ type: 'setVoice', voice });
    }
  }

  setEffects(effects: { [key: string]: number }) {
    this.gainNode.gain.setValueAtTime(effects.gain, this.audioContext.currentTime);
    this.distortionNode.curve = this.makeDistortionCurve(effects.distortion * 400);
    this.delayNode.delayTime.setValueAtTime(effects.delay, this.audioContext.currentTime);
  }

  noteOn(note: number) {
    if (this.audioWorklet) {
      this.audioWorklet.port.postMessage({ type: 'noteOn', note });
    }
  }

  noteOff(note: number) {
    if (this.audioWorklet) {
      this.audioWorklet.port.postMessage({ type: 'noteOff', note });
    }
  }

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  cleanup() {
    this.audioContext.close();
  }
}