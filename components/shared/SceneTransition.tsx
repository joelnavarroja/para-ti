"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SceneTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-6 py-10 text-center"
    >
      {children}
    </motion.div>
  );
}
