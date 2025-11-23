"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";

type TransitionContextType = {
  navigateWithTransition: (cb: () => void) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export const useTransition = () => useContext(TransitionContext);

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(
    null
  );
  const duration = 0.5;

  const navigateWithTransition = (cb: () => void) => {
    if (!isTransitioning) {
      setPendingCallback(() => cb);
      setIsTransitioning(true);
    }
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }
      setIsTransitioning(false);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [isTransitioning, pendingCallback]);

  return (
    <TransitionContext.Provider
      value={{ navigateWithTransition, isTransitioning }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 0 }}>{children}</div>
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: duration, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#18181b",
                zIndex: 50,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  );
}
