"use client";

import { useReducer, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  currentScene,
  experienceReducer,
  initialExperienceState,
} from "@/lib/sceneMachine";
import { QUIZ_QUESTIONS } from "@/lib/content";
import { startBackgroundMusic, stopBackgroundMusic } from "@/lib/sound";

import { IntroScreen } from "./scenes/01-IntroScreen";
import { RouletteRound1 } from "./scenes/02-RouletteRound1";
import { DebtReveal } from "./scenes/03-DebtReveal";
import { FakeWinReveal } from "./scenes/04-FakeWinReveal";
import { VirusSteal } from "./scenes/05-VirusSteal";
import { QuizIntro } from "./scenes/06-QuizIntro";
import { QuizQuestionScene } from "./scenes/07-QuizQuestion";
import { EvaluatingLoader } from "./scenes/08-EvaluatingLoader";
import { EvaluationResult } from "./scenes/09-EvaluationResult";
import { FakeCountdown } from "./scenes/10-FakeCountdown";
import { AdmirerNotification } from "./scenes/11-AdmirerNotification";
import { VideoPlayer } from "./scenes/12-VideoPlayer";
import { GiftEatenNotification } from "./scenes/13-GiftEatenNotification";
import { RouletteRound2 } from "./scenes/14-RouletteRound2";
import { PackOpening } from "./scenes/15-PackOpening";

export function ExperienceRoot() {
  const [state, dispatch] = useReducer(experienceReducer, initialExperienceState);
  const scene = currentScene(state);
  const advance = () => dispatch({ type: "ADVANCE" });

  // Estado de mute vive aquí (arriba del árbol) para sobrevivir a los
  // cambios de escena, que remontan cada componente vía AnimatePresence.
  // Solo controla la música de fondo (start/stopBackgroundMusic); los
  // efectos puntuales de cada escena (playFanfare, playRip, etc.) siguen
  // sonando siempre, sin pasar por este toggle.
  const [musicMuted, setMusicMuted] = useState(false);

  const toggleMute = () => {
    if (musicMuted) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    setMusicMuted((prev) => !prev);
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-neutral-950 via-red-950/40 to-neutral-950 text-white">
      <button
        type="button"
        onClick={toggleMute}
        aria-label={musicMuted ? "Activar música" : "Silenciar música"}
        data-testid="music-mute-toggle"
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-xl backdrop-blur transition hover:bg-black/60"
      >
        {musicMuted ? "🔇" : "🔊"}
      </button>
      <AnimatePresence mode="wait">
        {scene === "intro" && <IntroScreen key={scene} onAdvance={advance} />}
        {scene === "roulette1" && (
          <RouletteRound1 key={scene} onAdvance={advance} />
        )}
        {scene === "debtReveal" && (
          <DebtReveal
            key={scene}
            debt={state.debt}
            onPay={(newDebt) => {
              dispatch({ type: "SET_DEBT", debt: newDebt });
              advance();
            }}
          />
        )}
        {scene === "fakeWin" && <FakeWinReveal key={scene} onAdvance={advance} />}
        {scene === "virusSteal" && <VirusSteal key={scene} onAdvance={advance} />}
        {scene === "quizIntro" && <QuizIntro key={scene} onAdvance={advance} />}
        {scene.startsWith("quiz-") && (
          <QuizQuestionScene
            key={scene}
            question={QUIZ_QUESTIONS[Number(scene.split("-")[1])]}
            onAnswered={(answer) => {
              dispatch({
                type: "ANSWER_QUIZ",
                questionId: QUIZ_QUESTIONS[Number(scene.split("-")[1])].id,
                answer,
              });
              advance();
            }}
          />
        )}
        {scene === "evaluating" && (
          <EvaluatingLoader key={scene} onAdvance={advance} />
        )}
        {scene === "evaluationResult" && (
          <EvaluationResult key={scene} onAdvance={advance} />
        )}
        {scene === "fakeCountdown" && (
          <FakeCountdown key={scene} onAdvance={advance} />
        )}
        {scene === "admirerNotice" && (
          <AdmirerNotification key={scene} onAdvance={advance} />
        )}
        {scene === "videoPlayer" && (
          <VideoPlayer key={scene} onClose={advance} />
        )}
        {scene === "giftEatenNotice" && (
          <GiftEatenNotification key={scene} onAdvance={advance} />
        )}
        {scene === "roulette2" && (
          <RouletteRound2 key={scene} onAdvance={advance} />
        )}
        {scene === "packOpening" && <PackOpening key={scene} />}
      </AnimatePresence>
    </main>
  );
}
