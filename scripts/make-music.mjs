/**
 * Generates the background track for the match-announcement video.
 *
 * Everything is synthesized from scratch (no samples, no third-party audio) so
 * the repo stays free of licensing questions. Output: public/music.wav, which
 * the npm script converts to public/music.mp3.
 *
 * Style: energetic sports-anthem / electronic build -> drop, 120 BPM, A minor.
 * 120 BPM keeps one bar at exactly 2s = 60 frames at 30fps, so the scene cuts
 * in src/timeline.ts land on musical bar lines.
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 20;
const DURATION = BARS * BAR + 1.2; // 20 bars + tail
const N = Math.ceil(DURATION * SR);

const left = new Float32Array(N);
const right = new Float32Array(N);

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Adds a mono voice to the stereo buss with a constant-power pan. */
const add = (index, value, pan = 0) => {
  if (index < 0 || index >= N) return;
  const l = Math.cos(((pan + 1) * Math.PI) / 4);
  const r = Math.sin(((pan + 1) * Math.PI) / 4);
  left[index] += value * l;
  right[index] += value * r;
};

// A minor progression: i - VI - III - VII, one bar each.
const PROGRESSION = [
  {root: 220.0, chord: [220.0, 261.63, 329.63]}, // Am
  {root: 174.61, chord: [174.61, 220.0, 261.63]}, // F
  {root: 261.63, chord: [261.63, 329.63, 392.0]}, // C
  {root: 196.0, chord: [196.0, 246.94, 293.66]}, // G
];

const chordAtBar = (bar) => PROGRESSION[bar % PROGRESSION.length];

/* ---------------------------------------------------------------- voices */

const kick = (time, gain = 1) => {
  const len = 0.42;
  const start = Math.floor(time * SR);
  let phase = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 9);
    const pitch = 45 + 130 * Math.exp(-t * 38); // punchy pitch drop
    phase += (2 * Math.PI * pitch) / SR;
    const click = Math.exp(-t * 320) * (Math.random() * 2 - 1) * 0.35;
    add(start + i, (Math.sin(phase) * env + click * env) * 0.95 * gain);
  }
};

const clap = (time, gain = 1) => {
  const len = 0.3;
  const start = Math.floor(time * SR);
  let bp = 0;
  let lp = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    // Three quick bursts then a short tail: the classic clap shape.
    const burst =
      Math.exp(-((t - 0.0) ** 2) / 2e-5) +
      Math.exp(-((t - 0.011) ** 2) / 2e-5) +
      Math.exp(-((t - 0.022) ** 2) / 2e-5);
    const env = Math.min(1, burst) + Math.exp(-t * 16) * 0.55;
    const noise = Math.random() * 2 - 1;
    lp += (noise - lp) * 0.45;
    bp = lp - bp * 0.02;
    add(start + i, bp * env * 0.34 * gain, (Math.random() - 0.5) * 0.5);
  }
};

const hat = (time, open = false, gain = 1) => {
  const len = open ? 0.18 : 0.05;
  const start = Math.floor(time * SR);
  let prev = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const noise = Math.random() * 2 - 1;
    const hp = noise - prev; // crude high-pass
    prev = noise;
    const env = Math.exp(-t * (open ? 18 : 95));
    add(start + i, hp * env * 0.13 * gain, 0.28);
  }
};

const bass = (time, len, freq, gain = 1) => {
  const start = Math.floor(time * SR);
  let phase = 0;
  let lp = 0;
  let lp2 = 0;
  const total = len * SR;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env = clamp01(t / 0.006) * Math.exp(-t * 2.2) * clamp01((len - t) / 0.05);
    phase += (2 * Math.PI * freq) / SR;
    if (phase > 2 * Math.PI) phase -= 2 * Math.PI;
    const saw = phase / Math.PI - 1;
    const sub = Math.sin(phase);
    const raw = saw * 0.5 + sub * 0.7;
    // Two-pole lowpass with a slight opening sweep.
    const cutoff = 0.1 + 0.16 * Math.exp(-t * 6);
    lp += (raw - lp) * cutoff;
    lp2 += (lp - lp2) * cutoff;
    add(start + i, lp2 * env * 0.5 * gain);
  }
};

const stab = (time, len, freqs, gain = 1, detune = 0.006) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  const phases = [];
  freqs.forEach(() => phases.push([0, 0, 0]));
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env = clamp01(t / 0.01) * Math.exp(-t * 3.4) * clamp01((len - t) / 0.04);
    let v = 0;
    for (let c = 0; c < freqs.length; c++) {
      for (let d = 0; d < 3; d++) {
        const f = freqs[c] * (1 + (d - 1) * detune);
        phases[c][d] += (2 * Math.PI * f) / SR;
        if (phases[c][d] > 2 * Math.PI) phases[c][d] -= 2 * Math.PI;
        v += (phases[c][d] / Math.PI - 1) * 0.33; // detuned saw stack
      }
    }
    add(start + i, (v / freqs.length) * env * 0.16 * gain, Math.sin(t * 3) * 0.25);
  }
};

const brass = (time, len, freqs, gain = 1) => {
  // Wide, slightly gritty lead for the drop — the "anthem" layer.
  const start = Math.floor(time * SR);
  const total = len * SR;
  const phases = freqs.map(() => [0, 0]);
  let lp = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env =
      clamp01(t / 0.05) * (0.75 + 0.25 * Math.sin(t * 9)) * clamp01((len - t) / 0.18);
    let v = 0;
    for (let c = 0; c < freqs.length; c++) {
      for (let d = 0; d < 2; d++) {
        const f = freqs[c] * (d === 0 ? 1 : 1.004);
        phases[c][d] += (2 * Math.PI * f) / SR;
        if (phases[c][d] > 2 * Math.PI) phases[c][d] -= 2 * Math.PI;
        const saw = phases[c][d] / Math.PI - 1;
        v += Math.tanh(saw * 1.6) * 0.5;
      }
    }
    v /= freqs.length;
    lp += (v - lp) * 0.3;
    add(start + i, lp * env * 0.13 * gain, 0);
  }
};

const riser = (time, len, gain = 1) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  let bp = 0;
  let lp = 0;
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const p = t / len;
    const env = p * p;
    const noise = Math.random() * 2 - 1;
    const cutoff = 0.02 + 0.55 * p * p;
    lp += (noise - lp) * cutoff;
    bp = lp - bp * 0.3;
    // Tonal sweep riding on top of the noise sweep.
    phase += (2 * Math.PI * (220 + 900 * p * p)) / SR;
    add(start + i, (bp * 0.5 + Math.sin(phase) * 0.12) * env * 0.35 * gain, 0);
  }
};

const impact = (time, gain = 1) => {
  const start = Math.floor(time * SR);
  const len = 2.2;
  let lp = 0;
  let phase = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 2.6);
    const noise = Math.random() * 2 - 1;
    lp += (noise - lp) * 0.08;
    phase += (2 * Math.PI * (60 + 40 * Math.exp(-t * 6))) / SR;
    add(start + i, (lp * 1.6 + Math.sin(phase) * 0.8) * env * 0.4 * gain, 0);
  }
};

const crowd = (from, to, gain = 1) => {
  // Soft stadium-ambience bed: band-limited noise with a slow swell.
  const start = Math.floor(from * SR);
  const total = Math.floor((to - from) * SR);
  let lp = 0;
  let lp2 = 0;
  let hp = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const noise = Math.random() * 2 - 1;
    lp += (noise - lp) * 0.06;
    lp2 += (lp - lp2) * 0.06;
    hp = lp2 - hp * 0.0008;
    const swell = 0.6 + 0.4 * Math.sin(t * 0.8);
    const fade = clamp01(t / 1.5) * clamp01((to - from - t) / 1.5);
    add(start + i, hp * swell * fade * 0.5 * gain, (Math.random() - 0.5) * 0.6);
  }
};

/* -------------------------------------------------------------- arrangement */

crowd(0, BARS * BAR, 0.9);

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR;
  const {root, chord} = chordAtBar(bar);

  const intro = bar < 2; // bars 0-1   : atmosphere
  const groove = bar >= 2 && bar < 6; // bars 2-5   : beat enters
  const build = bar >= 6 && bar < 8; // bars 6-7   : build-up
  const drop = bar >= 8 && bar < 16; // bars 8-15  : full energy
  const outro = bar >= 16; // bars 16-19 : landing

  if (intro) {
    stab(t0, BAR, chord.map((f) => f / 2), 0.55);
    if (bar === 1) hat(t0 + BEAT * 2, true, 0.6);
  }

  if (groove || drop) {
    const g = drop ? 1 : 0.85;
    for (let b = 0; b < 4; b++) kick(t0 + b * BEAT, g);
    clap(t0 + BEAT, g);
    clap(t0 + BEAT * 3, g);
    for (let e = 0; e < 8; e++) {
      hat(t0 + e * (BEAT / 2), e % 4 === 3, e % 2 === 0 ? 0.9 * g : 0.6 * g);
    }
    // Off-beat bass pulse.
    for (let e = 0; e < 8; e++) {
      if (e % 2 === 1) bass(t0 + e * (BEAT / 2), BEAT / 2, root / 2, g);
    }
    bass(t0, BEAT / 2, root / 2, g * 1.05);
  }

  if (groove) {
    stab(t0 + BEAT * 0.5, BEAT * 0.9, chord, 0.75);
    stab(t0 + BEAT * 2.5, BEAT * 0.9, chord, 0.75);
  }

  if (build) {
    // Accelerating kick + snare-roll feel, filter opening into the drop.
    const hits = bar === 6 ? 8 : 16;
    for (let h = 0; h < hits; h++) {
      const t = t0 + (h * BAR) / hits;
      kick(t, 0.5 + (0.5 * h) / hits);
      hat(t, false, 0.5 + (0.5 * h) / hits);
      if (bar === 7) clap(t, 0.25 + (0.5 * h) / hits);
    }
    stab(t0, BAR, chord, 0.7);
  }

  // Accents are placed on the frames where the video cuts scenes:
  // bar 8 = line-ups, bar 14 = the SIYAH vs BEYAZ clash, bar 18 = outro.
  if (bar === 6) riser(t0, BAR * 2, 1);
  if (bar === 8) impact(t0, 1);
  if (bar === 14) impact(t0, 0.95);
  if (bar === 16) impact(t0, 0.9);

  if (drop) {
    brass(t0, BAR * 0.98, chord.map((f) => f * 2), 1);
    stab(t0 + BEAT * 0.5, BEAT * 0.9, chord, 0.9);
    stab(t0 + BEAT * 2.5, BEAT * 0.9, chord, 0.9);
    if (bar === 13 || bar === 15) riser(t0 + BEAT * 2, BEAT * 2, 0.7);
  }

  if (outro) {
    brass(t0, BAR * (bar === 19 ? 1.6 : 1), chord.map((f) => f * 2), 0.85);
    bass(t0, BAR, root / 2, 0.8);
    if (bar === 16) {
      for (let b = 0; b < 4; b++) kick(t0 + b * BEAT, 0.85);
      clap(t0 + BEAT, 0.85);
      clap(t0 + BEAT * 3, 0.85);
    }
    if (bar >= 18) kick(t0, 0.9);
  }
}

/* ------------------------------------------------------------- mix & write */

// Soft-clip, normalize, then fade the very end out.
let peak = 0;
for (let i = 0; i < N; i++) {
  left[i] = Math.tanh(left[i] * 0.85);
  right[i] = Math.tanh(right[i] * 0.85);
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const norm = peak > 0 ? 0.92 / peak : 1;
const fadeSamples = Math.floor(0.9 * SR);

const bytes = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const fade = i > N - fadeSamples ? (N - i) / fadeSamples : 1;
  const l = Math.max(-1, Math.min(1, left[i] * norm * fade));
  const r = Math.max(-1, Math.min(1, right[i] * norm * fade));
  bytes.writeInt16LE(Math.round(l * 32767), i * 4);
  bytes.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + bytes.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(bytes.length, 40);

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'music.wav');
mkdirSync(dirname(out), {recursive: true});
writeFileSync(out, Buffer.concat([header, bytes]));
console.log(`Wrote ${out} (${DURATION.toFixed(2)}s)`);
