"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const stuff = {
  shows: [
    {
      title: "Stranger Things",
      image: "stranger-things.jpg",
      link: "https://imdb.com/title/tt4574334/",
    },
    {
      title: "The Good Place",
      image: "the-good-place.jpg",
      link: "https://imdb.com/title/tt4955642/",
    },
    {
      title: "Tulsa King",
      image: "tulsa-king.jpg",
      link: "https://imdb.com/title/tt16358384/",
    },
    {
      title: "Good Girls",
      image: "good-girls.jpg",
      link: "https://imdb.com/title/tt6474378/",
    },
    {
      title: "Superstore",
      image: "superstore.jpg",
      link: "https://imdb.com/title/tt4477976/",
    },
    {
      title: "Chucky",
      image: "chucky.jpg",
      link: "https://imdb.com/title/tt8388390/",
    },
    {
      title: "A Man on the Inside",
      image: "a-man-on-the-inside.jpg",
      link: "https://imdb.com/title/tt26670955/",
    },
    {
      title: "Ghosts",
      image: "ghosts.jpg",
      link: "https://imdb.com/title/tt11379026/",
    },
    {
      title: "Lucifer",
      image: "lucifer.jpg",
      link: "https://imdb.com/title/tt4052886/",
    },
    {
      title: "Chad Powers",
      image: "chad-powers.jpg",
      link: "https://imdb.com/title/tt31449991/",
    },
  ],
  movies: [
    {
      title: "Elf",
      image: "elf.jpg",
      link: "https://imdb.com/title/tt0319343/",
    },
    {
      title: "Christmas Vacation",
      image: "christmas-vacation.jpg",
      link: "https://imdb.com/title/tt0097958/",
    },
  ],
  books: [
    {
      title: "Tales from the Farm",
      image: "tales-from-the-farm.jpg",
      link: "#",
    },
  ],
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const sections = Object.entries(stuff);

  return (
    <div className="flex flex-col justify-center items-center h-screen mt-5 mb-5">
      {sections.map(([category, items]) => {
        if (items.length === 0) return null;

        return (
          <section key={category} className="w-full max-w-xl px-4">
            <motion.section
              key={category}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 1,
                  },
                },
              }}
            >
              <div className="flex items-center px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground text-lg mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <h2 className="ml-2">{category}</h2>
              </div>
            </motion.section>

            <div className="space-y-2">
              <motion.div initial="hidden" animate="visible">
                {items.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center p-2 rounded-md hover:bg-zinc-800 transition-colors relative overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0, scale: 0.25 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onAnimationComplete={() => {
                      if (index === items.length - 1) setIsLoaded(true);
                    }}
                    transition={{
                      duration: 0.4,
                      delay: isLoaded ? 0.08 : index * 0.08,
                      scale: {
                        type: "spring",
                        visualDuration: 0.4,
                        bounce: 0.4,
                        delay: isLoaded ? 0.08 : index * 0.08,
                      },
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-10 w-10 object-cover rounded-md flex-shrink-0"
                      />
                    )}

                    <h3 className="ml-3 text-lg text-muted-foreground origin-left hover:text-zinc-200 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
