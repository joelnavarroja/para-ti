"use client";

import { motion } from "framer-motion";

export function CounterBadge({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      data-testid="counter-badge"
      className="rounded-full border-2 border-red-400 bg-red-950/60 px-5 py-2 text-xl font-bold text-red-300"
    >
      {amount}€
    </motion.div>
  );
}
