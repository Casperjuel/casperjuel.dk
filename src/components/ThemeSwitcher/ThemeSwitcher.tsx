"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ThemeSwitcher.module.scss";

const colorfulPalette = {
  "--gradient-1": "#ff0000",
  "--gradient-1-rgb": "255, 0, 0",
  "--gradient-2": "#ffff00",
  "--gradient-2-rgb": "255, 255, 0",
  "--gradient-3": "#00ff00",
  "--gradient-3-rgb": "0, 255, 0",
  "--gradient-4": "#00ffff",
  "--gradient-4-rgb": "0, 255, 255",
  "--gradient-5": "#0000ff",
  "--gradient-5-rgb": "0, 0, 255",
  "--gradient-6": "#ff00ff",
  "--gradient-6-rgb": "255, 0, 255",
  "--color-primary": "#ff00ff",
  "--color-primary-rgb": "255, 0, 255",
  "--color-secondary": "#00ffff",
  "--color-secondary-rgb": "0, 255, 255",
  "--glow-opacity": "0.4",
  "--chromatic-opacity": "0",
};

const monochromePalette = {
  "--gradient-1": "#ffffff",
  "--gradient-1-rgb": "255, 255, 255",
  "--gradient-2": "#ffffff",
  "--gradient-2-rgb": "255, 255, 255",
  "--gradient-3": "#ffffff",
  "--gradient-3-rgb": "255, 255, 255",
  "--gradient-4": "#ffffff",
  "--gradient-4-rgb": "255, 255, 255",
  "--gradient-5": "#ffffff",
  "--gradient-5-rgb": "255, 255, 255",
  "--gradient-6": "#ffffff",
  "--gradient-6-rgb": "255, 255, 255",
  "--color-primary": "#ffffff",
  "--color-primary-rgb": "255, 255, 255",
  "--color-secondary": "#888888",
  "--color-secondary-rgb": "136, 136, 136",
  "--glow-opacity": "0",
  "--chromatic-opacity": "1",
};

export const ThemeSwitcher = () => {
  const [isColorful, setIsColorful] = useState(true);

  const applyPalette = (palette: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const toggleTheme = () => {
    const newIsColorful = !isColorful;
    setIsColorful(newIsColorful);
    applyPalette(newIsColorful ? colorfulPalette : monochromePalette);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { isColorful: newIsColorful } }));
  };

  useEffect(() => {
    applyPalette(colorfulPalette);
  }, []);

  return (
    <motion.button
      className={styles.switcher}
      onClick={toggleTheme}
      aria-label={isColorful ? "Switch to monochrome theme" : "Switch to colorful theme"}
      aria-pressed={!isColorful}
      role="switch"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={styles.icon}
        animate={{ opacity: isColorful ? 1 : 0.4 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="8" r="3" fill="#ff0000" />
          <circle cx="8" cy="14" r="3" fill="#00ff00" />
          <circle cx="16" cy="14" r="3" fill="#0000ff" />
        </svg>
      </motion.div>

      <div className={styles.track}>
        <motion.div
          className={styles.thumb}
          animate={{ x: isColorful ? 0 : 28 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>

      <motion.div
        className={styles.icon}
        animate={{ opacity: isColorful ? 0.4 : 1 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher;
