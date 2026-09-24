"use client";

import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { playWhoosh } from "@/lib/sound";

export function SceneTransition({ children }: { children: ReactNode }) {
  useEffect(() => {
    playWhoosh();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -32, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-6 py-10 text-center"
    >
      {children}
    </motion.div>
  );
}
