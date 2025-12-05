"use client";

import { motion } from "framer-motion";
import styles from "./ScrollIndicator.module.scss";

export const ScrollIndicator = () => {
  return (
    <motion.div
      className={styles.indicator}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <motion.div
        className={styles.arrow}
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
      <span className={styles.text}>scroll</span>
    </motion.div>
  );
};

export default ScrollIndicator;
