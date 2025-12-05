"use client";

import { motion } from "framer-motion";
import styles from "./GlassCard.module.scss";

interface GlassCardProps {
  title: string;
  items: string[];
  delay?: number;
  index?: number;
  className?: string;
}

export const GlassCard = ({ title, items, delay = 0, index, className }: GlassCardProps) => {
  const isMobileStack = index !== undefined;

  const initialRotation = isMobileStack ? -15 : 0;
  const initialX = isMobileStack ? -100 : 0;
  const initialY = isMobileStack ? 80 : 30;

  const finalRotation = isMobileStack ? [-3, 1, -2][index] : 0;
  const finalX = isMobileStack ? [-4, 2, -1][index] : 0;
  const finalY = isMobileStack ? [0, 2, 4][index] : 0;

  return (
    <motion.div
      className={`${styles.card} ${className || ""}`}
      style={isMobileStack ? { zIndex: index + 1 } : undefined}
      initial={{
        opacity: 0,
        y: initialY,
        x: initialX,
        rotate: initialRotation,
        scale: isMobileStack ? 0.9 : 1
      }}
      whileInView={{
        opacity: 1,
        y: finalY,
        x: finalX,
        rotate: finalRotation,
        scale: 1
      }}
      transition={{
        delay: isMobileStack ? index * 0.2 : delay,
        duration: 0.6,
        type: "spring",
        stiffness: 80,
        damping: 12
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default GlassCard;
