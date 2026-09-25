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

/**
 * Trombón triste descendente ("wah wah wah waaah"), para remates cómicos
 * de mala noticia (ej. la deuda falsa). Cuatro notas en escalera
 * descendente con la última alargada y un vibrato lento en esa última
 * nota para el "waaah" final, siguiendo el mismo patrón de osciladores +
 * envolvente de ganancia que el resto de efectos de este archivo.
 */
export function playSadTrombone() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;
  const notes = [392.0, 349.23, 329.63, 293.66]; // G4 F4 E4 D4, escalera descendente
  const noteDuration = 0.32;
  notes.forEach((freq, i) => {
    const isLast = i === notes.length - 1;
    tone(context, {
      freq,
      duration: isLast ? noteDuration * 2 : noteDuration,
      type: "sawtooth",
      peakGain: 0.14,
      start: now + i * noteDuration,
    });
  });

  // Vibrato lento sobre la última nota, para el "waaah" final.
  const lastStart = now + (notes.length - 1) * noteDuration;
  const vibrato = context.createOscillator();
  const vibratoGain = context.createGain();
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(notes[notes.length - 1], lastStart);

  vibrato.type = "sine";
  vibrato.frequency.setValueAtTime(6, lastStart);
  vibratoGain.gain.setValueAtTime(10, lastStart);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);

  gain.gain.setValueAtTime(0.0001, lastStart);
  gain.gain.exponentialRampToValueAtTime(0.12, lastStart + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, lastStart + noteDuration * 2);

  osc.connect(gain);
  gain.connect(context.destination);
  vibrato.start(lastStart);
  osc.start(lastStart);
  vibrato.stop(lastStart + noteDuration * 2 + 0.05);
  osc.stop(lastStart + noteDuration * 2 + 0.05);
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

/**
 * Música de fondo (loop ligero estilo casino/gameshow).
 *
 * Reutiliza el mismo AudioContext compartido: un gain node maestro
 * (`musicGain`) por el que pasan todas las notas del loop, así el
 * "ducking" (bajar volumen durante fanfarrias/reveals) es solo mover la
 * ganancia de ese nodo en vez de tener que tocar cada oscilador. El loop
 * en sí es un arpegio suave (acorde mayor ascendente/descendente) programado
 * con setInterval: cada tick agenda una nota corta unos milisegundos por
 * delante para no depender de la precisión del timer del hilo principal.
 */
let musicGain: GainNode | null = null;
let musicIntervalId: number | null = null;
let musicStepIndex = 0;
// 0.045 resultaba prácticamente inaudible frente al resto de efectos
// (peakGain 0.15-0.22): se sube a un nivel que sí se percibe como música
// de fondo real sin tapar los efectos puntuales.
const MUSIC_BASE_GAIN = 0.1;
// Acorde mayor suave (I) recorrido en arpegio, tipo "gameshow" relajado.
const MUSIC_ARPEGGIO = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]; // C4 E4 G4 C5 G4 E4
const MUSIC_STEP_MS = 480;

export function startBackgroundMusic() {
  const context = getContext();
  if (!context) return;
  if (musicIntervalId !== null) return; // ya está sonando

  musicGain = context.createGain();
  musicGain.gain.setValueAtTime(MUSIC_BASE_GAIN, context.currentTime);
  musicGain.connect(context.destination);

  const playStep = () => {
    if (!context || !musicGain) return;
    const now = context.currentTime;
    const freq = MUSIC_ARPEGGIO[musicStepIndex % MUSIC_ARPEGGIO.length];
    const osc = context.createOscillator();
    const noteGain = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.6, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + MUSIC_STEP_MS / 1000);
    osc.connect(noteGain);
    noteGain.connect(musicGain);
    osc.start(now);
    osc.stop(now + MUSIC_STEP_MS / 1000 + 0.02);

    // Nota "pad" grave una octava abajo cada 2 pasos, para dar cuerpo de
    // acorde sostenido sin saturar el arpegio agudo.
    if (musicStepIndex % 2 === 0) {
      const pad = context.createOscillator();
      const padGain = context.createGain();
      pad.type = "sine";
      pad.frequency.setValueAtTime(freq / 2, now);
      padGain.gain.setValueAtTime(0.0001, now);
      padGain.gain.exponentialRampToValueAtTime(0.3, now + 0.08);
      padGain.gain.exponentialRampToValueAtTime(0.0001, now + (MUSIC_STEP_MS * 2) / 1000);
      pad.connect(padGain);
      padGain.connect(musicGain);
      pad.start(now);
      pad.stop(now + (MUSIC_STEP_MS * 2) / 1000 + 0.02);
    }

    musicStepIndex += 1;
  };

  playStep();
  musicIntervalId = window.setInterval(playStep, MUSIC_STEP_MS);
}

export function stopBackgroundMusic() {
  if (musicIntervalId !== null) {
    window.clearInterval(musicIntervalId);
    musicIntervalId = null;
  }
  if (musicGain && ctx) {
    const now = ctx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(musicGain.gain.value, now);
    musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  }
  musicGain = null;
  musicStepIndex = 0;
}

/**
 * Baja temporalmente el volumen de la música de fondo (sin detenerla) para
 * que no compita con una fanfarria/redoble/campanada, y lo restaura pasados
 * `ms`. Si la música no está sonando, no hace nada.
 */
export function duckMusic(ms = 900) {
  if (!musicGain || !ctx) return;
  const now = ctx.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value, now);
  musicGain.gain.linearRampToValueAtTime(MUSIC_BASE_GAIN * 0.18, now + 0.08);
  musicGain.gain.setValueAtTime(MUSIC_BASE_GAIN * 0.18, now + ms / 1000 - 0.15);
  musicGain.gain.linearRampToValueAtTime(MUSIC_BASE_GAIN, now + ms / 1000);
}

/**
 * Sonido "jackpot"/cha-ching, más grande que playChime: capas de campana
 * ascendente + un arpegio "sparkle" agudo encima, para el resultado
 * especial cuando sale elegido "Madian".
 */
export function playJackpot() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;

  // Capa 1: acorde de campana ascendente (más grande que playChime).
  const bellNotes = [783.99, 987.77, 1174.66, 1567.98]; // G5 B5 D6 G6
  bellNotes.forEach((freq, i) => {
    tone(context, { freq, duration: 0.5, type: "sine", peakGain: 0.2, start: now + i * 0.05 });
    tone(context, { freq: freq * 2, duration: 0.35, type: "triangle", peakGain: 0.08, start: now + i * 0.05 });
  });

  // Capa 2: arpegio "sparkle" agudo tipo tragaperras.
  const sparkle = [1567.98, 1864.66, 2093.0, 2489.02, 2793.83];
  sparkle.forEach((freq, i) => {
    tone(context, {
      freq,
      duration: 0.18,
      type: "square",
      peakGain: 0.07,
      start: now + 0.2 + i * 0.07,
    });
  });

  // Capa 3: "aplauso"/chispa de ruido, más denso que playChime.
  for (let i = 0; i < 10; i++) {
    noiseBurst(context, { start: now + 0.15 + i * 0.035, duration: 0.05, peakGain: 0.06 });
  }
}

/**
 * Remate/flourish grande para el payoff de acertar el número del quiz:
 * un barrido ascendente de osciladores en capas + un golpe final grave,
 * pensado para sonar encima de playChime + cola de playDrumroll sin
 * quedar redundante con ellos.
 */
export function playBigFlourish() {
  const context = getContext();
  if (!context) return;
  const now = context.currentTime;

  // Barrido ascendente en capas (glissando tipo "power-up").
  [0, 0.03, 0.06].forEach((offset, i) => {
    tone(context, {
      freq: 220,
      freqEnd: 1760,
      duration: 0.5,
      type: i === 0 ? "sawtooth" : "triangle",
      peakGain: 0.12 - i * 0.02,
      start: now + offset,
    });
  });

  // Golpe grave final para dar peso/impacto.
  tone(context, { freq: 90, duration: 0.35, type: "sine", peakGain: 0.22, start: now + 0.42 });
  noiseBurst(context, { start: now + 0.42, duration: 0.3, peakGain: 0.15 });
}
