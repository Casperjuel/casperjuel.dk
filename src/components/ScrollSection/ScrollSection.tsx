"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import styles from "./ScrollSection.module.scss";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const ScrollSection = ({ children, className, id }: ScrollSectionProps) => {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fade in as section enters viewport, fade out as it leaves
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`${styles.section} ${className || ""}`}
      style={{ opacity, y }}
    >
      {children}
    </motion.section>
  );
};

export default ScrollSection;
