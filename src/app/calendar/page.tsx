"use client";

import { useEffect, useState, useCallback } from "react";
import { Tooltip } from "@heroui/tooltip";
import { Separator } from "@/components/ui/separator";

type ViewMode = "week" | "year";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<ViewMode>("year");
  const [loading, setLoading] = useState(true);
  const [switching, setIsSwitching] = useState(false);
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
  const columnCount =
    view === "year" ? Math.ceil(Math.sqrt(progress.totalDaysInYear)) : 7;
  const columns =
    view === "year"
      ? "grid-cols-15 md:grid-cols-20 lg:grid-cols-20"
      : "grid-cols-7";

  useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      progress.totalDaysInYear * 9
    );
    return () => clearTimeout(timer);
  }, [progress.totalDaysInYear]);

  const viewChange = useCallback(
    (newView: ViewMode) => {
      if (newView === view) return;
      setIsSwitching(true);
      setTimeout(() => {
        setView(newView);
        setTimeout(() => {
          setIsSwitching(false);
        }, 50);
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

  return (
    <>
      <div className="bg-zinc-950 flex flex-col items-center justify-center min-h-screen">
        <div className={`grid gap-3 max-w-2xl mx-auto ${columns}`}>
          {Array.from({ length: totalDots }).map((_, index) => {
            const dayNumber = index + 1;
            const isPast = dayNumber < currentVal;
            const isToday = dayNumber === currentVal;
            const shouldShowProgress = isMounted && (isPast || isToday);

            return (
              <div
                key={`${view}-${index}`}
                className={`
                  dot-fade w-2 h-2 rounded-sm transition-all ease-in-out
                  ${
                    switching
                      ? "duration-500 opacity-0 scale-0"
                      : "duration-500 opacity-100 scale-100"
                  }
                  ${
                    shouldShowProgress
                      ? "bg-emerald-800"
                      : "bg-zinc-800 shadow-none"
                  }
                  ${
                    isToday && shouldShowProgress
                      ? "animate-pulse !bg-emerald-500"
                      : ""
                  }
                `}
                style={{
                  transitionDelay: switching ? "0ms" : `${index * 4}ms`,
                  animationDelay: loading ? `${index * 8}ms` : "0ms",
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 flex justify-center gap-2">
        <div
          className={`
      justify-center items-center flex border border-zinc-800 hover:border-zinc-700 px-2 py-2 rounded-full transition-all ease-in-out duration-1000 bg-zinc-950
      ${
        loading
          ? "opacity-0 scale-95"
          : switching
          ? "opacity-0 scale-95 blur-sm duration-500"
          : "opacity-100 scale-100 blur-0 duration-500"
      }
    `}
        >
          <button
            onClick={() => viewChange("week")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
              view === "week"
                ? "text-zinc-300"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            WEEK
          </button>

          <Separator orientation="vertical" className="h-4 bg-zinc-800" />

          <Tooltip
            content={`${percentage}% of the ${tooltipLabel}`}
            delay={300}
            closeDelay={300}
            offset={15}
          >
            <div className="text-center text-md text-zinc-500 px-4 py-2">
              <p>
                {view === "year" ? "Day " : "Day "}
                <span className="text-zinc-300">{currentVal}</span>/{totalVal}
              </p>
            </div>
          </Tooltip>

          <Separator orientation="vertical" className="h-4 bg-zinc-800" />

          <button
            onClick={() => viewChange("year")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
              view === "year"
                ? "text-zinc-300"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            YEAR
          </button>
        </div>
      </div>
    </>
  );
}
