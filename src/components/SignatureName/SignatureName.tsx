"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./SignatureName.module.scss";

export const SignatureName = () => {
  const name = "Casper juel";
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 4000); // 4s delay before showing name

    return () => clearTimeout(timer);
  }, []);

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotate: -5,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9] as const,
      },
    }),
  };

  return (
    <motion.h1
      className={styles.name}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {name.split("").map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          className={styles.letter}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default SignatureName;
