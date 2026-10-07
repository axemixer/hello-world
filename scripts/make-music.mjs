/**
 * Generates the background track for the match-announcement video.
 *
 * Everything is synthesized from scratch — no samples, no third-party audio and
 * no existing melody — so the repo stays free of licensing questions. The style
 * is an original orchestral/choral anthem in the European-cup-night mould:
 * timpani, string swells, a choir pad and a brass fanfare.
 *
 * 80 BPM keeps one bar at exactly 3s = 90 frames at 30fps, so the scene cuts in
 * src/timeline.ts land on musical bar lines. 5 bars = the 15s video.
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const BPM = 80;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 5;
const DURATION = BARS * BAR + 1.6; // 5 bars + ring-out
const N = Math.ceil(DURATION * SR);

const left = new Float32Array(N);
const right = new Float32Array(N);

const TAU = Math.PI * 2;
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Adds a mono voice to the stereo buss with a constant-power pan. */
const add = (index, value, pan = 0) => {
  if (index < 0 || index >= N) return;
  const l = Math.cos(((pan + 1) * Math.PI) / 4);
  const r = Math.sin(((pan + 1) * Math.PI) / 4);
  left[index] += value * l;
  right[index] += value * r;
};

/* ------------------------------------------------------------- harmony */

// D major — the bright, regal end of the keyboard: I - IV - V - vi - I.
const PROGRESSION = [
  {root: 146.83, chord: [146.83, 185.0, 220.0, 293.66]}, // D
  {root: 196.0, chord: [196.0, 246.94, 293.66, 392.0]}, // G
  {root: 220.0, chord: [220.0, 277.18, 329.63, 440.0]}, // A
  {root: 246.94, chord: [246.94, 293.66, 369.99, 493.88]}, // Bm
  {root: 146.83, chord: [146.83, 185.0, 220.0, 293.66]}, // D
];

/* ---------------------------------------------------------------- voices */

/** Orchestral timpani: pitched thump with a long body and a mallet click. */
const timpani = (time, freq, gain = 1) => {
  const len = 1.8;
  const start = Math.floor(time * SR);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 3.2) * clamp01(t / 0.004);
    const pitch = freq * (1 + 0.5 * Math.exp(-t * 26));
    phase += (TAU * pitch) / SR;
    const noise = Math.random() * 2 - 1;
    lp += (noise - lp) * 0.12;
    const skin = lp * Math.exp(-t * 26) * 0.5;
    add(start + i, (Math.sin(phase) * 0.95 + skin) * env * gain);
  }
};

/** String ensemble: detuned saws, slow bow attack, gentle vibrato, spread wide. */
const strings = (time, len, freqs, gain = 1, attack = 0.5) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  const phases = freqs.map(() => [0, 0, 0, 0]);
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env =
      clamp01(t / attack) * clamp01((len - t) / 0.45) * (0.92 + 0.08 * Math.sin(t * 4.2));
    let vl = 0;
    let vr = 0;
    for (let c = 0; c < freqs.length; c++) {
      // Four players per desk, each slightly out of tune and out of phase.
      for (let d = 0; d < 4; d++) {
        const detune = 1 + (d - 1.5) * 0.0032;
        const vib = 1 + 0.0022 * Math.sin(TAU * 5.2 * t + c * 1.7 + d);
        phases[c][d] += (TAU * freqs[c] * detune * vib) / SR;
        if (phases[c][d] > TAU) phases[c][d] -= TAU;
        const saw = phases[c][d] / Math.PI - 1;
        if (d % 2 === 0) vl += saw;
        else vr += saw;
      }
    }
    const k = 0.26;
    lpL += (vl / (freqs.length * 2) - lpL) * k;
    lpR += (vr / (freqs.length * 2) - lpR) * k;
    add(start + i, lpL * env * 0.3 * gain, -0.5);
    add(start + i, lpR * env * 0.3 * gain, 0.5);
  }
};

/**
 * Choir pad: stacked sines weighted like vowel formants, with a slow swell and
 * a breath of noise. This is what makes the track feel like a full stadium.
 */
const choir = (time, len, freqs, gain = 1) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  const WEIGHTS = [1, 0.5, 0.34, 0.2, 0.13, 0.08];
  const phases = freqs.map(() => WEIGHTS.map(() => Math.random() * TAU));
  let breath = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env =
      clamp01(t / 0.7) * clamp01((len - t) / 0.6) * (0.88 + 0.12 * Math.sin(t * 2.6));
    let v = 0;
    for (let c = 0; c < freqs.length; c++) {
      // Two voices per part, a few cents apart, so the pad never sounds static.
      for (let s = 0; s < 2; s++) {
        const f0 = freqs[c] * (s === 0 ? 1 : 1.0035);
        const vib = 1 + 0.004 * Math.sin(TAU * 4.6 * t + c * 2.1 + s);
        for (let h = 0; h < WEIGHTS.length; h++) {
          phases[c][h] += (TAU * f0 * (h + 1) * vib) / SR;
          if (phases[c][h] > TAU) phases[c][h] -= TAU;
          v += Math.sin(phases[c][h]) * WEIGHTS[h];
        }
      }
    }
    const noise = Math.random() * 2 - 1;
    breath += (noise - breath) * 0.05;
    v = v / (freqs.length * 4.4) + breath * 0.08;
    add(start + i, v * env * 0.34 * gain, Math.sin(t * 0.7) * 0.3);
  }
};

/** Brass fanfare: saturated saws with a hard front edge and an opening filter. */
const brass = (time, len, freqs, gain = 1) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  const phases = freqs.map(() => [0, 0]);
  let lp = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const env =
      clamp01(t / 0.035) * (0.82 + 0.18 * Math.sin(t * 7)) * clamp01((len - t) / 0.2);
    let v = 0;
    for (let c = 0; c < freqs.length; c++) {
      for (let d = 0; d < 2; d++) {
        const f = freqs[c] * (d === 0 ? 1 : 1.005);
        phases[c][d] += (TAU * f) / SR;
        if (phases[c][d] > TAU) phases[c][d] -= TAU;
        const saw = phases[c][d] / Math.PI - 1;
        v += Math.tanh(saw * 2.1) * 0.5;
      }
    }
    v /= freqs.length;
    const cutoff = 0.2 + 0.3 * clamp01(t / 0.25);
    lp += (v - lp) * cutoff;
    add(start + i, lp * env * 0.17 * gain, 0);
  }
};

/** Harp-like pluck for the sparkle over the top. */
const pluck = (time, freq, gain = 1) => {
  const len = 1.4;
  const start = Math.floor(time * SR);
  let phase = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 4.5) * clamp01(t / 0.003);
    phase += (TAU * freq) / SR;
    const v = Math.sin(phase) + Math.sin(phase * 2) * 0.22 + Math.sin(phase * 3) * 0.08;
    add(start + i, v * env * 0.1 * gain, Math.sin(freq / 180) * 0.6);
  }
};

/** Cymbal swell rising into a downbeat. */
const swell = (time, len, gain = 1) => {
  const start = Math.floor(time * SR);
  const total = len * SR;
  let prev = 0;
  let bp = 0;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    const p = t / len;
    const noise = Math.random() * 2 - 1;
    const hp = noise - prev;
    prev = noise;
    bp += (hp - bp) * 0.55;
    add(start + i, bp * p * p * 0.3 * gain, Math.sin(t * 2) * 0.5);
  }
};

/** Crash: the same texture, decaying, for the big downbeats. */
const crash = (time, gain = 1) => {
  const len = 2.6;
  const start = Math.floor(time * SR);
  let prev = 0;
  let bp = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const noise = Math.random() * 2 - 1;
    const hp = noise - prev;
    prev = noise;
    bp += (hp - bp) * 0.5;
    add(start + i, bp * Math.exp(-t * 2.1) * 0.26 * gain, (Math.random() - 0.5) * 0.8);
  }
};

/** Deep sub under each impact — felt more than heard. */
const sub = (time, gain = 1) => {
  const len = 2.0;
  const start = Math.floor(time * SR);
  let phase = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 2.4) * clamp01(t / 0.01);
    phase += (TAU * (46 + 16 * Math.exp(-t * 7))) / SR;
    add(start + i, Math.sin(phase) * env * 0.5 * gain);
  }
};

/* -------------------------------------------------------------- arrangement */

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR;
  const {root, chord} = PROGRESSION[bar];
  const high = chord.map((f) => f * 2);

  // Every bar is a scene in the video, so every bar opens on an accent.
  crash(t0, bar === 0 || bar === 4 ? 1 : 0.7);
  timpani(t0, root / 2, bar === 4 ? 1 : 0.9);
  sub(t0, bar === 0 || bar === 3 || bar === 4 ? 1 : 0.7);

  strings(t0, BAR, chord, 1, bar === 0 ? 0.8 : 0.35);
  choir(t0, BAR, high, bar === 0 ? 0.75 : 1);

  if (bar === 0) {
    // Opening: the crest forms, so the fanfare answers the first timpani hit.
    brass(t0 + BEAT * 2, BEAT * 2, [chord[1], chord[2], chord[3]], 1);
    for (let i = 0; i < 4; i++) {
      pluck(t0 + BEAT * 2 + i * 0.16, high[i % high.length] * 2, 0.9);
    }
  }

  if (bar === 1 || bar === 2) {
    // Line-up boards: keep it moving, but underneath the names.
    timpani(t0 + BEAT * 2, root / 2, 0.55);
    brass(t0 + BEAT * 3, BEAT, [chord[2], chord[3]], 0.62);
    for (let i = 0; i < 6; i++) {
      pluck(t0 + BEAT * 0.5 + i * 0.28, high[i % high.length] * 2, 0.6);
    }
  }

  if (bar === 2) swell(t0 + BEAT * 2, BEAT * 2, 1); // into the showdown

  if (bar === 3) {
    // Head-to-head: the dramatic bar, timpani on every beat.
    for (let b = 1; b < 4; b++) timpani(t0 + b * BEAT, root / 2, 0.8);
    brass(t0, BAR * 0.9, high, 1);
    swell(t0 + BEAT * 3, BEAT, 1);
  }

  if (bar === 4) {
    // Resolution: everything holds through the fixture card and rings out.
    brass(t0, BAR * 1.35, high, 1);
    timpani(t0 + BEAT * 2, root / 2, 0.7);
    strings(t0 + BAR, 1.5, chord, 0.8, 0.2);
    choir(t0 + BAR, 1.5, high, 0.85);
    for (let i = 0; i < 5; i++) {
      pluck(t0 + BEAT * 2 + i * 0.2, high[i % high.length] * 2, 0.8);
    }
  }
}

/* ------------------------------------------------------------- mix & write */

let peak = 0;
for (let i = 0; i < N; i++) {
  left[i] = Math.tanh(left[i] * 0.9);
  right[i] = Math.tanh(right[i] * 0.9);
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const norm = peak > 0 ? 0.93 / peak : 1;
const fadeSamples = Math.floor(1.1 * SR);

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
