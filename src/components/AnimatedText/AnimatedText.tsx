"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./AnimatedText.module.scss";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
}

export const AnimatedText = ({
  text,
  className,
  as: Tag = "p",
  stagger = 0.03,
}: AnimatedTextProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`${styles.container} ${className || ""}`}>
      <Tag className={styles.text}>
        {words.map((word, wordIndex) => {
          // Calculate the progress range for this word
          const start = wordIndex / words.length;
          const end = (wordIndex + 1) / words.length;

          return (
            <Word
              key={wordIndex}
              word={word}
              progress={scrollYProgress}
              start={start}
              end={end}
            />
          );
        })}
      </Tag>
    </div>
  );
};

interface WordProps {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}

const Word = ({ word, progress, start, end }: WordProps) => {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);

  return (
    <motion.span className={styles.word} style={{ opacity, y }}>
      {word}&nbsp;
    </motion.span>
  );
};

export default AnimatedText;
