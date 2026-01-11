"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useTransition } from "./transition";
import Prefetch from "./prefetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Projects() {
  const pathname = usePathname();
  const router = useRouter();
  const controls = useAnimation();
  const transition = useTransition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname == "/") {
      controls.start({
        opacity: 1,
        pointerEvents: "auto",
        rotate: 0,
        transition: { duration: 0.4, ease: "backOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        pointerEvents: "none",
        rotate: 180,
        transition: { duration: 0.3 },
      });
    }
  }, [pathname, controls]);

  const handleNav = (path: string) => {
    setOpen(false);
    transition?.navigateWithTransition(() => {
      router.push(path);
    });
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.button
          initial={{ opacity: 0, rotate: 180, pointerEvents: "none" }}
          animate={controls}
          className="fixed top-4 left-2 p-2 rounded-md shadow border hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors duration-300 focus:outline-none focus:ring-0 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform -scale-x-100 -scale-y-100"
          >
            <path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
            <path d="M21 20V4" />
          </svg>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        side="right"
        align="start"
        sideOffset={10}
      >
        <Prefetch link={"/calendar"}>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              handleNav("/calendar");
            }}
          >
            calendar
          </DropdownMenuItem>
        </Prefetch>

        <Prefetch link={"/github"}>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              handleNav("/github");
            }}
          >
            github to email
          </DropdownMenuItem>
        </Prefetch>

        <Prefetch link={"/resources"}>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              handleNav("/resources");
            }}
          >
            resources
          </DropdownMenuItem>
        </Prefetch>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
