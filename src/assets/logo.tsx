"use client";

import { useRef, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import styles from "./logo.module.scss";

const mousePos = { x: 0, y: 0 };

function Model() {
  const { scene } = useGLTF("/cj_logo.gltf");
  const ref = useRef<THREE.Group>(null);
  const currentScale = useRef(3);
  const targetScale = 0.03;
  const startTime = useRef<number | null>(null);
  const animationDelay = 0;
  const targetRotation = useRef({ x: 0, y: 0 });
  const introRotation = useRef(Math.PI * 2); // Start with a full rotation
  const introComplete = useRef(false);


  useFrame((state) => {
    if (ref.current) {
      if (startTime.current === null) {
        startTime.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - startTime.current;

      if (elapsed >= animationDelay) {
        currentScale.current += (targetScale - currentScale.current) * 0.02;
      }
      ref.current.scale.setScalar(currentScale.current);

      // Intro rotation animation
      if (!introComplete.current) {
        introRotation.current += (0 - introRotation.current) * 0.02;
        ref.current.rotation.y = introRotation.current;

        // Once intro rotation is nearly done, enable cursor tracking
        if (Math.abs(introRotation.current) < 0.1) {
          introComplete.current = true;
        }
      } else {
        // Face the cursor with smooth lerping (offset to compensate for model's default rotation)
        const yOffset = -0.55; // Compensate for model facing slightly right
        targetRotation.current.y = mousePos.x * 0.5 + yOffset;
        targetRotation.current.x = -mousePos.y * 0.3;

        ref.current.rotation.y += (targetRotation.current.y - ref.current.rotation.y) * 0.05;
        ref.current.rotation.x += (targetRotation.current.x - ref.current.rotation.x) * 0.05;
      }
    }
  });

  return (
    <group ref={ref} scale={3} position={[0.5, 0, 0]} rotation={[0, Math.PI * 2, 0]}>
      <primitive object={scene} position={[-0.5, 0, 0]} rotation={[0, 0, 0]} />
    </group>
  );
}

export const Logo = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left/right tilt (-90 to 90)
        // beta: front/back tilt (-180 to 180)
        mousePos.x = Math.max(-1, Math.min(1, e.gamma / 30));
        mousePos.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); // offset by 45 for natural phone holding angle
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      if (scrollY > threshold) {
        setOpacity(0.5);
      } else {
        setOpacity(1);
      }
    };

    // Check if device orientation is available (mobile)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ requires permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // We'll request on first touch
        const requestPermission = () => {
          (DeviceOrientationEvent as any).requestPermission()
            .then((response: string) => {
              if (response === 'granted') {
                window.addEventListener('deviceorientation', handleDeviceOrientation);
              }
            })
            .catch(console.error);
          window.removeEventListener('touchstart', requestPermission);
        };
        window.addEventListener('touchstart', requestPermission, { once: true });
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return (
    <div className={styles.logoWrapper} style={{ opacity, transition: "opacity 0.5s ease" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[0, 0, 10]} intensity={0.5} color="#00ffff" />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/cj_logo.gltf");
