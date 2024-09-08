class SynthProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.frequency = 440;
    this.voice = 'sine';
    this.activeNotes = new Set();

    this.port.onmessage = (event) => {
      if (event.data.type === 'setVoice') {
        this.voice = event.data.voice;
      } else if (event.data.type === 'noteOn') {
        this.activeNotes.add(event.data.note);
      } else if (event.data.type === 'noteOff') {
        this.activeNotes.delete(event.data.note);
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0];

    for (let i = 0; i < channel.length; i++) {
      let sample = 0;
      for (const note of this.activeNotes) {
        const frequency = 440 * Math.pow(2, (note - 69) / 12);
        const t = this.phase / sampleRate;
        switch (this.voice) {
          case 'sine':
            sample += Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            sample += Math.sign(Math.sin(2 * Math.PI * frequency * t));
            break;
          case 'sawtooth':
            sample += 2 * (frequency * t - Math.floor(0.5 + frequency * t));
            break;
          case 'triangle':
            sample += 2 * Math.abs(2 * (frequency * t - Math.floor(0.5 + frequency * t))) - 1;
            break;
        }
      }
      channel[i] = sample / Math.max(this.activeNotes.size, 1);
      this.phase++;
    }

    return true;
  }
}

registerProcessor('synth-processor', SynthProcessor);