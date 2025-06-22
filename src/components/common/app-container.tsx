// src/components/common/app-container.tsx
"use client";
import { motion } from "framer-motion";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-soft"
    >
      <div className="w-full max-w-md mx-auto">{children}</div>
    </motion.div>
  );
}