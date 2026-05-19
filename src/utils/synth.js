const NOTE_FREQS = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
};

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playNote(note, octave = 4) {
  const ctx = getCtx();
  const base = NOTE_FREQS[note];
  if (!base) return;

  const freq = base * Math.pow(2, octave - 4);
  const now = ctx.currentTime;
  const duration = 2.5;

  const master = ctx.createGain();
  master.connect(ctx.destination);

  // Piano-like ADSR envelope
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.55, now + 0.008);
  master.gain.exponentialRampToValueAtTime(0.28, now + 0.12);
  master.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
  master.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Harmonics for a piano-like timbre
  [
    { mult: 1,   gain: 1.0  },
    { mult: 2,   gain: 0.18 },
    { mult: 3,   gain: 0.09 },
    { mult: 4,   gain: 0.04 },
    { mult: 5,   gain: 0.02 },
  ].forEach(({ mult, gain }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * mult;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + duration);
  });
}
