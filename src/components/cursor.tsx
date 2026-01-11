"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import useIsTouchDevice from "@/components/mobile";

export default function CursorMain() {
  const isMobile = useIsTouchDevice();
  const pathname = usePathname();
  const [isHovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const oMousePos = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const cSize = isHovered ? 30 : 15;
  const oSize = isHovered ? 60 : 45;

  const smoothOptions = { damping: 10, stiffness: 100, mass: 0.1 };
  const lessSmoothOptions = { damping: 15, stiffness: 200, mass: 0.1 };

  const cSmoothMouse = {
    x: useSpring(mousePos.x, lessSmoothOptions),
    y: useSpring(mousePos.y, lessSmoothOptions),
  };

  const oSmoothMouse = {
    x: useSpring(oMousePos.x, smoothOptions),
    y: useSpring(oMousePos.y, smoothOptions),
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    let timeout: NodeJS.Timeout;

    const mMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mousePos.x.set(clientX - cSize / 2);
      mousePos.y.set(clientY - cSize / 2);
      oMousePos.x.set(clientX - oSize / 2);
      oMousePos.y.set(clientY - oSize / 2);

      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 3000);
    };

    const mMouseOver = () => setHovered(true);
    const mMouseLeave = () => setHovered(false);
    const mClick = () => setHovered(false);

    window.addEventListener("mousemove", mMouseMove);
    document.addEventListener("click", mClick);

    const links = document.querySelectorAll("a, button, img, input");
    links.forEach((link) => {
      link.addEventListener("mouseenter", mMouseOver);
      link.addEventListener("mouseleave", mMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", mMouseMove);
      document.removeEventListener("click", mClick);
      clearTimeout(timeout);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", mMouseOver);
        link.removeEventListener("mouseleave", mMouseLeave);
      });
    };
  }, [cSize, oSize, pathname]);

  return (
    <>
      {!isMobile && (
        <>
          <motion.div
            style={{
              left: cSmoothMouse.x,
              top: cSmoothMouse.y,
              position: "fixed",
              width: cSize,
              height: cSize,
              backgroundColor: "white",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 9999,
              mixBlendMode: "difference",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.3s",
            }}
            animate={{ width: cSize, height: cSize }}
          />
          <motion.div
            style={{
              left: oSmoothMouse.x,
              top: oSmoothMouse.y,
              position: "fixed",
              width: oSize,
              height: oSize,
              border: "2px solid white",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 9998,
              mixBlendMode: "difference",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.3s",
            }}
            animate={{ width: oSize, height: oSize }}
          />
        </>
      )}
    </>
  );
}
