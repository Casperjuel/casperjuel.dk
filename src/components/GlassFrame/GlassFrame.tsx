"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GlassFrame.module.scss";

const applyColorfulTheme = () => {
  osc(4, 0.1, 0.8)
    .color(1.04, 0, -1.1)
    .rotate(0.30, 0.1)
    .modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time))
    .out(o0);
};

const applyMonochromeTheme = () => {
  osc(4, 0.1, 0.8)
    .saturate(0)
    .contrast(1.2)
    .rotate(0.30, 0.1)
    .modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time))
    .out(o0);
};

export const GlassFrame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hydraRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpanded(true);
    }, 4000); // 4s delay - let 3D logo play before growing

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || hydraRef.current) return;

    const initHydra = async () => {
      const Hydra = (await import("hydra-synth")).default;

      hydraRef.current = new Hydra({
        canvas: canvasRef.current,
        detectAudio: false,
        enableStreamCapture: false,
      });

      applyColorfulTheme();
    };

    initHydra();

    return () => {
      if (hydraRef.current) {
        hydraRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<{ isColorful: boolean }>) => {
      if (!hydraRef.current) return;
      if (e.detail.isColorful) {
        applyColorfulTheme();
      } else {
        applyMonochromeTheme();
      }
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themechange', handleThemeChange as EventListener);
  }, []);

  return (
    <div className={`${styles.frameContainer} ${expanded ? styles.expanded : ""}`}>
      <canvas ref={canvasRef} className={styles.hydraCanvas} />
      <div className={styles.glow} />
      <div className={styles.border} />
      <div className={styles.innerShadow} />
    </div>
  );
};
