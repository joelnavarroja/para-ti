export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  response: string;
}

const GROUP_NAMES = [
  "Joel",
  "Gaia",
  "Johann",
  "Madian",
  "Irene",
  "Andrea",
  "Dani",
  "Jordi",
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "guapo",
    question: "¿Quién es la persona más guapa del grupo?",
    options: GROUP_NAMES,
    response: "Incorrecto. Es la madre de Jordi y la madre de Johann.",
  },
  {
    id: "cadaver",
    question:
      "Si sin querer matas a alguien, ¿a quién llamarías para esconder el cadáver?",
    options: GROUP_NAMES,
    response: "Vaya, vaya... interesante elección. Anotado.",
  },
  {
    id: "millonario",
    question: "¿Quién será millonario primero?",
    options: GROUP_NAMES,
    response: "Ninguno. Todos vais a acabar pidiéndole dinero a Jordi.",
  },
  {
    id: "numero",
    question: "Adivina el número en el que estoy pensando",
    options: ["1", "7", "13", "42"],
    response: "¡Acertaste!",
  },
];

export const ROULETTE_ROUND_1_SEGMENTS = [
  "Viaje en avión ✈️",
  "TV 8K 📺",
  "Diamante 💎",
  "PS6 🎮",
  "Nada 😬",
  "Casi... 😅",
  "Coche 🚗",
  "Reloj de oro ⌚",
];

export const ROULETTE_ROUND_2_SEGMENTS = [
  "???",
  "???",
  "Tu regalo 🎁",
  "???",
  "???",
  "Tu regalo 🎁",
  "???",
  "???",
];

export const NARRATIVE_TEXTS = {
  intro: {
    title: "Tenemos una sorpresa para ti",
    subtitle: "Toca para empezar",
  },
  roulette1: {
    title: "Ruleta de la suerte 🎰",
    subtitle: "¡Vamos a ver qué te toca!",
    spinCta: "Girar",
  },
  debtReveal: {
    title: "Nos debes 20€ a todos",
    subtitle: "¿Quieres intentarlo otra vez?",
    cta: "Pagar 5€ y volver a girar",
  },
  fakeWin: {
    title: "¡¡¡HAS GANADO!!! 🎉",
    subtitle: "No nos lo podemos creer, menuda suerte",
    cta: "Continuar",
  },
  virusSteal: {
    title: "⚠️ Virus detectado",
    subtitle: "Alguien te lo ha robado todo. Lo sentimos mucho.",
    cta: "¿Y ahora qué?",
  },
  quizIntro: {
    title: "Todavía tienes una oportunidad",
    subtitle: "Responde 4 preguntas y acierta para recuperarlo todo",
    cta: "Empezar",
  },
  evaluating: {
    title: "Evaluando si te mereces un premio...",
  },
  evaluationResult: {
    title: "No, porque Pedro Sánchez se lo ha quedado",
    subtitle: "Tu regalo somos todos nosotros",
    cta: "...",
  },
  fakeCountdown: {
    title: "Es broma",
    subtitle: "Abre tu regalo en...",
  },
  admirerNotice: {
    title: "Tu admirador secreto tiene un vídeo para ti",
    subtitle: "Lo ha grabado desde África",
    cta: "Ver vídeo",
  },
  giftEatenNotice: {
    step1: "Mondongo te ha dado el regalo",
    step2: "Hostia, se lo ha comido. No pasa nada, yo te lo recupero.",
    cta: "Recuperarlo",
  },
  roulette2: {
    title: "Última oportunidad, va en serio",
    subtitle: "Esta vez sí",
    spinCta: "Girar",
  },
  packOpening: {
    title: "Has desbloqueado una experiencia única e inigualable",
    subtitle: "Tus amigos han tenido que vender la casa pero aquí la tienes",
    cta: "Abrir",
  },
};

export const FAKE_PAYMENT = { initialDebt: -20, retryFee: -5 };
