"use client";

import { motion } from "framer-motion";
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from "@/components/ui/kibo-ui/glimpse";

interface Props {
  data: any;
  domain: string;
  index: number;
}

export function GlimpseItem({ data, domain, index }: Props) {
  return (
    <a href={data.url} target="_blank" rel="noreferrer">
      <Glimpse closeDelay={0} openDelay={0}>
        <GlimpseTrigger asChild>
          <div className="relative inline-block group">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                scale: {
                  type: "spring",
                  visualDuration: 0.4,
                  bounce: 0.5,
                  delay: index * 0.05,
                },
              }}
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {domain}
              </p>
            </motion.div>
            <span className="absolute inset-x-0 bottom-0 h-px bg-zinc-300 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </GlimpseTrigger>
        <GlimpseContent className="w-80 my-2">
          <GlimpseImage src={data.image || undefined} />
          <GlimpseTitle>{data.title}</GlimpseTitle>
          <GlimpseDescription>{data.description}</GlimpseDescription>
        </GlimpseContent>
      </Glimpse>
    </a>
  );
}
