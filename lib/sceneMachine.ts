export const SCENE_ORDER = [
  "intro",
  "roulette1",
  "debtReveal",
  "fakeWin",
  "virusSteal",
  "quizIntro",
  "quiz-0",
  "quiz-1",
  "quiz-2",
  "quiz-3",
  "evaluating",
  "evaluationResult",
  "fakeCountdown",
  "admirerNotice",
  "videoPlayer",
  "giftEatenNotice",
  "roulette2",
  "packOpening",
] as const;

export type SceneId = (typeof SCENE_ORDER)[number];

export interface ExperienceState {
  sceneIndex: number;
  debt: number;
  quizAnswers: Record<string, string>;
}

export const initialExperienceState: ExperienceState = {
  sceneIndex: 0,
  debt: 0,
  quizAnswers: {},
};

export type ExperienceAction =
  | { type: "ADVANCE" }
  | { type: "SET_DEBT"; debt: number }
  | { type: "ANSWER_QUIZ"; questionId: string; answer: string };

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "ADVANCE":
      return {
        ...state,
        sceneIndex: Math.min(state.sceneIndex + 1, SCENE_ORDER.length - 1),
      };
    case "SET_DEBT":
      return { ...state, debt: action.debt };
    case "ANSWER_QUIZ":
      return {
        ...state,
        quizAnswers: { ...state.quizAnswers, [action.questionId]: action.answer },
      };
    default:
      return state;
  }
}

export function currentScene(state: ExperienceState): SceneId {
  return SCENE_ORDER[state.sceneIndex];
}
