"use client";

import { useEffect, useState, useCallback } from "react";
import { Tooltip } from "@heroui/tooltip";
import { Separator } from "@/components/ui/separator";
import * as motion from "motion/react-client";

type ViewMode = "week" | "year";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<ViewMode>("year");
  const [switching, setIsSwitching] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const [progress, setProgress] = useState({
    currentDayOfYear: 1,
    totalDaysInYear: 365,
    currentDayOfWeek: 1,
    daysInWeek: 7,
  });

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const isLeap = (y: number) =>
      (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const totalDaysInYear = isLeap(year) ? 366 : 365;
    const start = new Date(year, 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const currentDayOfYear = Math.floor(diff / oneDay);
    const dayOfWeek = now.getDay();
    const currentDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    setProgress({
      currentDayOfYear,
      totalDaysInYear,
      currentDayOfWeek,
      daysInWeek: 7,
    });

    const timer = setTimeout(() => setIsMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalDots = view === "year" ? progress.totalDaysInYear : 7;
  const columns =
    view === "year"
      ? "grid-cols-15 md:grid-cols-20 lg:grid-cols-20"
      : "grid-cols-7";

  const viewChange = useCallback(
    (newView: ViewMode) => {
      if (newView === view) return;
      setIsSwitching(true);
      setTimeout(() => {
        setView(newView);
        setTimeout(() => setIsSwitching(false), 50);
      }, 500);
    },
    [view]
  );

  const currentVal =
    view === "year" ? progress.currentDayOfYear : progress.currentDayOfWeek;
  const totalVal =
    view === "year" ? progress.totalDaysInYear : progress.daysInWeek;
  const percentage = ((currentVal / totalVal) * 100).toFixed(1);
  const tooltipLabel = view === "year" ? "year complete" : "week complete";

  const hoverTrigger = animationFinished && !switching ? "group" : "";

  return (
    <>
      <div className="bg-zinc-950 flex flex-col items-center justify-center min-h-screen">
        <div className={`grid gap-3 max-w-2xl mx-auto ${columns}`}>
          {Array.from({ length: totalDots }).map((_, index) => {
            const dayNumber = index + 1;
            const isPast = dayNumber < currentVal;
            const isToday = dayNumber === currentVal;
            const shouldShowProgress = isMounted && (isPast || isToday);
            const delay = switching ? index * 0.004 : index * 0.008;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: delay,
                  scale: {
                    type: "spring",
                    visualDuration: 0.4,
                    bounce: 0.5,
                    delay: delay,
                  },
                }}
              >
                <motion.div
                  whileHover={{ scale: 4 }}
                  transition={{ duration: 0.1 }}
                  className={`
                    w-2 h-2 rounded-sm transition-all ease-in-out
                    ${switching ? "opacity-0 scale-0" : "opacity-100 scale-100"}
                    ${shouldShowProgress ? "bg-emerald-800" : "bg-zinc-800"}
                    ${
                      isToday && shouldShowProgress
                        ? "animate-pulse !bg-emerald-500"
                        : ""
                    }
                  `}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        className="fixed bottom-10 left-0 right-0 flex justify-center z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: switching ? 0.5 : 1,
          scale: switching ? 0.98 : 1,
        }}
        onAnimationComplete={() => setAnimationFinished(true)}
        transition={{
          duration: 0.4,
          delay: 2.8,
          scale: {
            type: "spring",
            visualDuration: 0.5,
            bounce: 0.4,
            delay: 2.8,
          },
        }}
      >
        <div
          className={`
            flex items-center gap-1 border border-zinc-800 hover:border-zinc-700 
            px-2 py-2 rounded-full bg-zinc-950 shadow-2xl transition-all duration-500
            ${animationFinished ? "overflow-visible" : "overflow-hidden"}
            ${switching ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
        >
          <motion.div
            whileHover={animationFinished ? { scale: 1.05 } : {}}
            className={`relative inline-block ${hoverTrigger}`}
          >
            <button
              onClick={() => viewChange("week")}
              className={`px-4 py-2 text-xs tracking-widest font-bold transition-colors duration-300 ${
                view === "week"
                  ? "text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              WEEK
            </button>
            <span className="absolute inset-x-4 bottom-1 h-0.5 bg-emerald-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
          </motion.div>

          <Separator orientation="vertical" className="h-4 bg-zinc-800" />

          <Tooltip
            content={`${percentage}% of the ${tooltipLabel}`}
            closeDelay={0}
            offset={20}
          >
            <div
              className={`relative inline-block px-4 py-2 cursor-default ${hoverTrigger}`}
            >
              <p className="text-sm font-medium text-zinc-500">
                {view === "year" ? "Day " : "Day "}
                <span className="text-zinc-200">{currentVal}</span>
                <span className="text-zinc-700"> / {totalVal}</span>
              </p>
              <span className="absolute inset-x-4 bottom-1 h-0.5 bg-zinc-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </Tooltip>

          <Separator orientation="vertical" className="h-4 bg-zinc-800" />

          <motion.div
            whileHover={animationFinished ? { scale: 1.05 } : {}}
            className={`relative inline-block ${hoverTrigger}`}
          >
            <button
              onClick={() => viewChange("year")}
              className={`px-4 py-2 text-xs tracking-widest font-bold transition-colors duration-300 ${
                view === "year"
                  ? "text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              YEAR
            </button>
            <span className="absolute inset-x-4 bottom-1 h-0.5 bg-emerald-400 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
