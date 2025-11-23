"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import useIsTouchDevice from "./mobile";

type props = {
  link: string;
  noPriority?: boolean;
  children: ReactNode;
};

export default function Prefetch({ link, noPriority, children }: props) {
  const router = useRouter();
  const isMobile = useIsTouchDevice();

  useEffect(() => {
    if (isMobile && !noPriority) {
      router.prefetch(link);
    }
  }, [isMobile, link, router]);

  return (
    <div
      onMouseEnter={() => {
        router.prefetch(link);
      }}
    >
      {children}
    </div>
  );
}
