"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import styles from "./GlassButton.module.scss";

interface GlassButtonProps {
  href: string;
  children: React.ReactNode;
}

export const GlassButton = ({ href, children }: GlassButtonProps) => {
  const containerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      container.style.setProperty("--mouse-x", x.toString());
      container.style.setProperty("--mouse-y", y.toString());
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.a
      ref={containerRef}
      href={href}
      className={styles.button}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover="hover"
      whileTap="tap"
    >
      {/* LAYER 1: Outer Glow */}
      <motion.div
        className={styles.glow}
        variants={{
          hover: { opacity: 0.8 },
          tap: { opacity: 0.4, scale: 0.95 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* LAYER 2: Gradient Rim */}
      <motion.div
        className={styles.rim}
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {/* LAYER 3: Dark Inner Body */}
        <div className={styles.body}>
          <div className={styles.innerGlow} />
          <div className={styles.sheen} />
          <div className={styles.depthShadow} />
        </div>
      </motion.div>

      {/* Rim highlight - specular on outer edge */}
      <motion.div
        className={styles.rimHighlight}
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 0 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* LAYER 4: Specular Highlight */}
      <motion.div
        className={styles.specular}
        variants={{
          hover: { opacity: 0.9 },
          tap: { opacity: 0.2 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Secondary highlight */}
      <motion.div
        className={styles.secondaryHighlight}
        variants={{
          hover: { opacity: 0.7 },
          tap: { opacity: 0.3 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Text content */}
      <span className={styles.text}>{children}</span>
    </motion.a>
  );
};

export default GlassButton;
