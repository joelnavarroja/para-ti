"use client";

/**
 * Efectos de sonido sintetizados con la Web Audio API.
 *
 * Decisión de diseño: en vez de usar Howler.js (que está pensado para
 * reproducir archivos de audio) o traer mp3/wav de licencia dudosa,
 * generamos los efectos con osciladores + envolventes de ganancia en
 * tiempo real. Esto evita binarios en el repo, mantiene el bundle
 * ligero y da control total sobre timing/tono para sincronizar con las
 * animaciones de framer-motion. Howler no aporta nada aquí porque no
 * hay archivos que gestionar (streaming, sprites, formatos, etc.).
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) {
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  context: AudioContext,
  {
    freq,
    start,
    duration,
    type = "sine",
    peakGain = 0.2,
    freqEnd,
  }: {
    freq: number;
    start: number;
    duration: number;
    type?: OscillatorType;
    peakGain?: number;
    freqEnd?: number;
  }
) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(freqEnd, 1),
      start + duration
    );
  }
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peakGain, start + duration * 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst(
  context: AudioContext,
  { start, duration, peakGain = 0.15 }: { start: number; duration: number; peakGain?: number }
) {
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peakGain, start + duration * 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(gain);
  gain.connect(context.destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

/** Tick corto y seco, usado al elegir/seleccionar algo (ej. NumberPicker). */
export function playTick() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, { freq: 880, duration: 0.06, type: "square", peakGain: 0.12, start: now });
}

/** Whoosh de aire para transiciones de escena. */
export function playWhoosh() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  noiseBurst(context, { start: now, duration: 0.35, peakGain: 0.06 });
  tone(context, {
    freq: 700,
    freqEnd: 120,
    duration: 0.35,
    type: "sine",
    peakGain: 0.05,
    start: now,
  });
}

/** Fanfarria triunfal para el reveal final. */
export function playFanfare() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    tone(context, {
      freq,
      duration: 0.35,
      type: "triangle",
      peakGain: 0.18,
      start: now + i * 0.14,
    });
  });
  tone(context, {
    freq: 1046.5,
    duration: 0.8,
    type: "triangle",
    peakGain: 0.2,
    start: now + notes.length * 0.14,
  });
}

/** Redoble de tambor sintetizado (percusión de ruido) para tensión creciente. */
export function playDrumroll(durationSeconds = 2.5) {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  const hitDuration = 0.09;
  let t = now;
  const end = now + durationSeconds;
  let interval = 0.16;
  while (t < end) {
    noiseBurst(context, { start: t, duration: hitDuration, peakGain: 0.1 });
    tone(context, { freq: 110, duration: hitDuration, type: "sine", peakGain: 0.08, start: t });
    t += interval;
    // acelera el redoble a medida que se acerca el final (más tensión)
    interval = Math.max(0.045, interval * 0.94);
  }
}

/** Campana/aplauso corto para respuestas "correctas" del quiz. */
export function playChime() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  tone(context, { freq: 987.77, duration: 0.25, type: "sine", peakGain: 0.16, start: now });
  tone(context, { freq: 1318.5, duration: 0.35, type: "sine", peakGain: 0.14, start: now + 0.08 });
  // pequeño "aplauso" de ruido
  for (let i = 0; i < 6; i++) {
    noiseBurst(context, {
      start: now + 0.1 + i * 0.03,
      duration: 0.04,
      peakGain: 0.05,
    });
  }
}

/**
 * Gemido/honk absurdo tipo payaso o pato de goma con vibrato, para
 * momentos "WTF gracioso" (ej. el virus). Deliberadamente ridículo, no
 * tenso: pitch bend descendente + vibrato rápido + hipo final agudo.
 */
export function playComicHonk() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;

  const osc = context.createOscillator();
  const gain = context.createGain();
  const vibrato = context.createOscillator();
  const vibratoGain = context.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(130, now + 0.5);

  vibrato.type = "sine";
  vibrato.frequency.setValueAtTime(22, now);
  vibratoGain.gain.setValueAtTime(35, now);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

  osc.connect(gain);
  gain.connect(context.destination);
  vibrato.start(now);
  osc.start(now);
  vibrato.stop(now + 0.55);
  osc.stop(now + 0.55);

  // Hipo/gemido final agudo, tipo remate de payaso.
  tone(context, {
    freq: 260,
    freqEnd: 520,
    duration: 0.15,
    type: "square",
    peakGain: 0.12,
    start: now + 0.48,
  });
}

/** Flash sonoro breve y agudo, usado en el "rasgado" del sobre. */
export function playRip() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  noiseBurst(context, { start: now, duration: 0.25, peakGain: 0.18 });
  tone(context, {
    freq: 1600,
    freqEnd: 200,
    duration: 0.25,
    type: "sawtooth",
    peakGain: 0.1,
    start: now,
  });
}
