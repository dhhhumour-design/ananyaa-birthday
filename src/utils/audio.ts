/**
 * Web Audio API Melodic Music Box & Sound FX Engine
 * Generates sweet, ethereal music box / celesta melodies and sound effects
 * without relying on external MP3 files or network requests.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private sequenceTimeout: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a single celesta/music box note with sweet harmonic overtones
   */
  private playNote(frequency: number, duration: number = 1.2, volume: number = 0.25) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Pure sine with subtle octave bell overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now);

    // Filter to warm the music box sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);

    // Exponential decay envelope (music box pluck)
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Happy Birthday / Dreamy Arpeggio Melody Loop
   */
  public startMelody() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // F Major / D Minor pentatonic romantic music box sequence
    // Note frequencies: C5, D5, E5, F5, G5, A5, C6
    const notes = [
      { f: 523.25, d: 0.4 }, // C5
      { f: 523.25, d: 0.4 }, // C5
      { f: 587.33, d: 0.8 }, // D5
      { f: 523.25, d: 0.8 }, // C5
      { f: 698.46, d: 0.8 }, // F5
      { f: 659.25, d: 1.4 }, // E5
      { f: 0, d: 0.4 },      // Rest

      { f: 523.25, d: 0.4 }, // C5
      { f: 523.25, d: 0.4 }, // C5
      { f: 587.33, d: 0.8 }, // D5
      { f: 523.25, d: 0.8 }, // C5
      { f: 783.99, d: 0.8 }, // G5
      { f: 698.46, d: 1.4 }, // F5
      { f: 0, d: 0.4 },      // Rest

      { f: 523.25, d: 0.4 }, // C5
      { f: 523.25, d: 0.4 }, // C5
      { f: 1046.50, d: 0.8 },// C6
      { f: 880.00, d: 0.8 }, // A5
      { f: 698.46, d: 0.8 }, // F5
      { f: 659.25, d: 0.8 }, // E5
      { f: 587.33, d: 1.2 }, // D5
      { f: 0, d: 0.4 },      // Rest

      { f: 932.33, d: 0.4 }, // Bb5
      { f: 932.33, d: 0.4 }, // Bb5
      { f: 880.00, d: 0.8 }, // A5
      { f: 698.46, d: 0.8 }, // F5
      { f: 783.99, d: 0.8 }, // G5
      { f: 698.46, d: 1.8 }, // F5 (warm final bell)
      { f: 0, d: 1.2 },      // Ambient pause
    ];

    let step = 0;
    const playNext = () => {
      if (!this.isPlaying) return;

      const current = notes[step];
      if (current.f > 0) {
        this.playNote(current.f, current.d * 1.8, 0.22);
      }

      step = (step + 1) % notes.length;
      this.sequenceTimeout = window.setTimeout(playNext, current.d * 680);
    };

    playNext();
  }

  public stopMelody() {
    this.isPlaying = false;
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }
  }

  public toggleMelody(): boolean {
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  public isMelodyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Sound FX: Sparkling Chime Burst
   */
  public playSparkle() {
    this.initContext();
    if (!this.ctx) return;
    const freqs = [784, 880, 1046.5, 1318.5, 1567.98, 2093];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        this.playNote(f, 0.6, 0.12);
      }, i * 65);
    });
  }

  /**
   * Sound FX: Candle Blowout (soft airy whisper + rising sparkle)
   */
  public playCandleBlow() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Breath / whoosh simulation with white noise buffer
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.75);

    // Followed by gentle magic chimes
    setTimeout(() => {
      this.playSparkle();
    }, 450);
  }

  /**
   * Sound FX: Gift Box Pop & Open
   */
  public playGiftPop() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sweet pop sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.35);

    setTimeout(() => {
      this.playSparkle();
    }, 120);
  }
}

export const sound = new BirthdayAudioEngine();
