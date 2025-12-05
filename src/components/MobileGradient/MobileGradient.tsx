"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./MobileGradient.module.scss";

export const MobileGradient = () => {
  const { scrollYProgress } = useScroll();

  const backgroundPositionY = useTransform(scrollYProgress, [0, 1], ["0%", "300%"]);

  return (
    <div className={styles.gradient}>
      <motion.div
        className={styles.border}
        style={{ backgroundPositionY }}
      />
    </div>
  );
};

export default MobileGradient;
