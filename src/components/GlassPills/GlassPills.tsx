"use client";

import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./GlassPills.module.scss";

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  velocity: number;
}

interface TitleBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface GlassPillProps {
  size: number;
  x: number;
  y: number;
  popping?: boolean;
}

const GlassPill = ({ size, x, y, popping }: GlassPillProps) => {
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    springX.set(x);
    springY.set(y);
  }, [x, y, springX, springY]);

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        x: springX,
        y: springY,
        position: "absolute",
        left: 0,
        top: 0,
        cursor: "pointer",
      }}
      className={styles.pill}
      initial={{ scale: 1, opacity: 0.8 }}
      animate={popping ? {
        scale: [1, 1.3, 0],
        opacity: [0.8, 0.8, 0],
      } : { scale: 1, opacity: 0.8 }}
      transition={popping ? { duration: 0.3, ease: "easeOut" } : undefined}
    >
      <div className={styles.clickTarget} />
      <div className={styles.glow} />
      <div className={styles.rim}>
        <div className={styles.body}>
          <div className={styles.innerGlow} />
          <div className={styles.sheen} />
          <div className={styles.depthShadow} />
        </div>
      </div>
      <div className={styles.chromatic} />
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`${styles.specular} ${styles.specularBall}`}
      />
      <div className={styles.secondaryHighlight} />
    </motion.div>
  );
};

const PopParticle = ({ x, y, size, angle, velocity }: Particle) => (
  <motion.div
    className={styles.particle}
    style={{ width: size, height: size, left: x, top: y }}
    initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
    animate={{
      scale: 0,
      opacity: 0,
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity,
    }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
);

export const GlassPills = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<{ left: number; top: number; right: number; bottom: number; width: number; height: number } | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const titleBoxesRef = useRef<TitleBox[]>([]);
  const scrollRef = useRef({ y: 0, velocity: 0 });
  const poppedBallsRef = useRef<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // 5s delay before showing balls

    return () => clearTimeout(timer);
  }, []);

  const [balls, setBalls] = useState<Ball[]>([
    { id: 1, x: 100, y: 100, vx: 3, vy: 2, size: 60 },
    { id: 2, x: 300, y: 200, vx: -2, vy: 3, size: 90 },
    { id: 3, x: 500, y: 150, vx: 2.5, vy: -2, size: 120 },
    { id: 4, x: 200, y: 400, vx: -3, vy: -1.5, size: 75 },
    { id: 5, x: 400, y: 300, vx: 1.5, vy: 2.5, size: 150 },
    { id: 6, x: 600, y: 250, vx: -2, vy: -2.5, size: 100 },
    { id: 7, x: 700, y: 350, vx: 2, vy: 1.5, size: 55 },
    { id: 8, x: 150, y: 500, vx: -1.5, vy: -2, size: 130 },
    { id: 9, x: 450, y: 450, vx: 2.5, vy: -1, size: 70 },
    { id: 10, x: 550, y: 100, vx: -2.5, vy: 2, size: 85 },
  ]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [poppingBalls, setPoppingBalls] = useState<Set<number>>(new Set());

  const popBall = useCallback((ballId: number) => {
    if (poppedBallsRef.current.has(ballId)) return;
    poppedBallsRef.current.add(ballId);

    const ball = balls.find(b => b.id === ballId);
    if (!ball) return;

    setPoppingBalls(prev => new Set(prev).add(ballId));

    const numParticles = 8;
    const centerX = ball.x + ball.size / 2;
    const centerY = ball.y + ball.size / 2;
    const newParticles: Particle[] = [];

    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      newParticles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        size: ball.size * 0.15 + Math.random() * ball.size * 0.1,
        angle,
        velocity: 80 + Math.random() * 60,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setBalls(prev => prev.filter(b => b.id !== ballId));
      setPoppingBalls(prev => {
        const next = new Set(prev);
        next.delete(ballId);
        return next;
      });
    }, 300);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  }, [balls]);

  const updateTitleBoxes = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const titles = document.querySelectorAll('h1, h2');
    const boxes: TitleBox[] = [];

    titles.forEach((title) => {
      const rect = title.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        boxes.push({
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          right: rect.right - containerRect.left,
          bottom: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    });

    titleBoxesRef.current = boxes;
  }, []);

  const updateFrameBounds = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 20;
      frameRef.current = {
        left: padding,
        top: padding,
        right: rect.width - padding,
        bottom: rect.height - padding,
        width: rect.width - padding * 2,
        height: rect.height - padding * 2,
      };
    }
  }, []);

  useEffect(() => {
    updateFrameBounds();
    updateTitleBoxes();
    window.addEventListener("resize", updateFrameBounds);

    const friction = 0.998;
    const cursorForce = 0.8;
    const cursorRadius = 150;
    const bounceDamping = 0.95;
    const minBounceVelocity = 3;

    const checkTitleCollision = (
      ballX: number,
      ballY: number,
      ballSize: number,
      box: TitleBox
    ) => {
      const radius = ballSize / 2;
      const ballCenterX = ballX + radius;
      const ballCenterY = ballY + radius;
      const closestX = Math.max(box.left, Math.min(ballCenterX, box.right));
      const closestY = Math.max(box.top, Math.min(ballCenterY, box.bottom));
      const distX = ballCenterX - closestX;
      const distY = ballCenterY - closestY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        const overlap = radius - distance;
        const normalX = distance > 0 ? distX / distance : 0;
        const normalY = distance > 0 ? distY / distance : -1;
        return { collision: true, normalX, normalY, overlap };
      }
      return { collision: false, normalX: 0, normalY: 0, overlap: 0 };
    };

    const animate = () => {
      if (!frameRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      updateTitleBoxes();
      const frame = frameRef.current;
      const mouse = mouseRef.current;
      const scrollVelocity = scrollRef.current.velocity;

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy, size, id } = ball;
          const radius = size / 2;

          const dx = x + radius - mouse.x;
          const dy = y + radius - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorRadius && dist > 0) {
            const force = ((cursorRadius - dist) / cursorRadius) * cursorForce;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
          }

          vx *= friction;
          vy *= friction;
          x += vx;
          y += vy;

          for (const box of titleBoxesRef.current) {
            const { collision, normalX, normalY, overlap } = checkTitleCollision(x, y, size, box);
            if (collision) {
              x += normalX * overlap * 1.5;
              y += normalY * overlap * 1.5;
              const dotProduct = vx * normalX + vy * normalY;
              if (dotProduct < 0) {
                vx = (vx - 2 * dotProduct * normalX) * bounceDamping;
                vy = (vy - 2 * dotProduct * normalY) * bounceDamping;

                // Ensure minimum bounce velocity
                const bounceVel = Math.sqrt(vx * vx + vy * vy);
                if (bounceVel < minBounceVelocity) {
                  const scale = minBounceVelocity / (bounceVel || 1);
                  vx = normalX * minBounceVelocity + (Math.random() - 0.5) * 2;
                  vy = normalY * minBounceVelocity + (Math.random() - 0.5) * 2;
                }

                const scrollInfluence = Math.abs(scrollVelocity) * 0.15;
                const scrollDirection = scrollVelocity > 0 ? 1 : -1;
                vy += scrollDirection * scrollInfluence * (1 + Math.random() * 0.5);
                vx += (Math.random() - 0.5) * scrollInfluence * 0.5;
              }
            }
          }

          if (x < frame.left) { x = frame.left; vx = Math.abs(vx) * 0.9; }
          if (x + size > frame.right) { x = frame.right - size; vx = -Math.abs(vx) * 0.9; }
          if (y < frame.top) { y = frame.top; vy = Math.abs(vy) * 0.9; }
          if (y + size > frame.bottom) { y = frame.bottom - size; vy = -Math.abs(vy) * 0.9; }

          if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) {
            vx += (Math.random() - 0.5) * 0.5;
            vy += (Math.random() - 0.5) * 0.5;
          }

          const maxVel = 8 + Math.abs(scrollVelocity) * 0.1;
          const vel = Math.sqrt(vx * vx + vy * vy);
          if (vel > maxVel) {
            vx = (vx / vel) * maxVel;
            vy = (vy / vel) * maxVel;
          }

          return { id, x, y, vx, vy, size };
        })
      );

      scrollRef.current.velocity *= 0.95;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateFrameBounds);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateFrameBounds, updateTitleBoxes]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        };
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth) * 2 - 1;
        const y = (e.clientY / innerHeight) * 2 - 1;
        containerRef.current.style.setProperty("--mouse-x", x.toString());
        containerRef.current.style.setProperty("--mouse-y", y.toString());
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      if (deltaTime > 0) {
        scrollRef.current.velocity = ((currentScrollY - lastScrollY) / deltaTime) * 16;
        scrollRef.current.y = currentScrollY;
      }
      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSceneClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (const ball of balls) {
      const centerX = ball.x + ball.size / 2;
      const centerY = ball.y + ball.size / 2;
      const distance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
      if (distance < ball.size * 0.8) {
        popBall(ball.id);
        return;
      }
    }
  }, [balls, popBall]);

  return (
    <motion.div
      className={styles.scene}
      ref={containerRef}
      onClick={handleSceneClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AnimatePresence>
        {balls.map((ball) => (
          <GlassPill
            key={ball.id}
            size={ball.size}
            x={ball.x}
            y={ball.y}
            popping={poppingBalls.has(ball.id)}
          />
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {particles.map((particle) => (
          <PopParticle key={particle.id} {...particle} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default GlassPills;
