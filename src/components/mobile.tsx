"use client";

import { useEffect, useState } from "react";

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export default function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const {
      isAndroid,
      isIPad13,
      isIPhone13,
      isWinPhone,
      isMobileSafari,
      isTablet,
    } = require("react-device-detect");

    setIsTouch(
      isAndroid ||
        isIPad13 ||
        isIPhone13 ||
        isWinPhone ||
        isMobileSafari ||
        isTablet ||
        isTouchDevice()
    );
  }, []);

  return isTouch;
}

// https://stackoverflow.com/questions/59494037/how-to-detect-the-device-on-react-ssr-app-with-next-js
