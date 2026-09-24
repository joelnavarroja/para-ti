"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function PackOpening() {
  const [opened, setOpened] = useState(false);
  const t = NARRATIVE_TEXTS.packOpening;

  return (
    <SceneTransition>
      <h1 className="text-2xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="pack"
            initial={{ scale: 1 }}
            animate={{
              boxShadow: [
                "0 0 20px 4px rgba(251,191,36,0.4)",
                "0 0 40px 10px rgba(251,191,36,0.8)",
                "0 0 20px 4px rgba(251,191,36,0.4)",
              ],
            }}
            transition={{ duration: 1.4, repeat: Infinity }}
            exit={{
              scale: 1.3,
              rotateY: 90,
              opacity: 0,
              transition: { duration: 0.35, ease: "easeIn" },
            }}
            className="flex h-64 w-44 items-center justify-center rounded-2xl border-4 border-amber-300 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600"
          >
            <button
              type="button"
              onClick={() => setOpened(true)}
              data-testid="pack-button"
              className="text-5xl"
            >
              🎁
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ scale: 0.3, rotateY: -90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="flex flex-col items-center gap-4"
          >
            <ConfettiBurst variant="realistic" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/regalo-final.jpg"
              alt="Tu regalo"
              data-testid="final-gift-image"
              className="w-72 rounded-2xl border-4 border-amber-300 shadow-2xl shadow-amber-500/50"
            />
            <p className="text-xl font-bold text-amber-200">🎉 Feliz cumpleaños 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneTransition>
  );
}
