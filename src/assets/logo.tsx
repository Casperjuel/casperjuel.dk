import { motion } from "framer-motion";
import styles from "./logo.module.scss";

const logoPath = `M318.1,112.8C268.9,129,268.9,129,226,151.5l-4.6,2.4l-0.7,5.2c-0.4,3.1-0.8,6.2-1.2,9.4
  c-4.3,33.6-9.6,75.4-21,112.9c-12.8,42.2-30.7,70.5-54.5,86.6c-5.3,2.2-10.3,3.3-14.8,3.3c-7.7,0-14.1-3.2-19.5-9.8
  c-10.3-12.7-14.8-36.6-10.6-56.8l0.1-0.5l0.1-0.5c3.3-30.7,15.2-61,34.5-87.6c18.7-25.8,43.5-47,71.6-61.3c1.6-0.6,3-1.4,4.3-2
  c0.4-0.2,0.9-0.4,1.3-0.7l5-2.5l0.5-5.6c1-11.8,1.7-23.6,2.3-35l1-19.3l-15.1,7c-31,14.3-61.8,32.9-94.1,56.7l-0.2,0.2
  c-3.4,2.7-6.8,5.4-10.1,8.1c-8.5,7-16.6,13.5-25.5,18.6l-0.3,0.2l-0.3,0.2c-7.1,4.8-14.9,7.3-22.3,7.3c-8.8,0-16.8-3.4-22.7-9.7
  c-6.6-7-9.7-17.1-9-28.3c1.2-16.7,7.5-35.5,18.9-55.8l0.2-0.3l0.2-0.3C46.4,78,55.9,65.7,66.7,57.8c9-6.6,18.7-10.1,27.9-10.1
  c10.5,0,19.2,4.7,23.2,12.6c5.7,11.3,1.8,27.6-10.9,44.9`;

const dotPath = `M221.2,47.3c10.4-4.6,16.4-6.9,19.1-18.5c13.3-34.3-37.3-39.6-41-6.9C197.9,34,207.4,50.3,221.2,47.3`;

export const Logo = () => (

  <svg
    className={styles.logo}
    viewBox="0 0 338.1 391.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Colorful gradient */}
      <linearGradient id="logo-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5e00" />
        <stop offset="25%" stopColor="#ff00aa" />
        <stop offset="50%" stopColor="#00ff41" />
        <stop offset="75%" stopColor="#00aaff" />
        <stop offset="100%" stopColor="#7a00ff" />
      </linearGradient>

      {/* Clip path for the logo stroke */}
      <clipPath id="logo-clip">
        <path
          d={logoPath}
          fill="none"
          stroke="white"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={dotPath} />
      </clipPath>

      {/* Liquid glass filter */}
      <filter id="logo-liquid" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blurred" />

        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008"
          numOctaves="4"
          seed="42"
          result="noise"
        />

        <feDisplacementMap
          in="blurred"
          in2="noise"
          scale="50"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />

        <feColorMatrix
          in="displaced"
          type="saturate"
          values="3"
          result="saturated"
        />

        <feSpecularLighting
          in="noise"
          surfaceScale="3"
          specularConstant="0.8"
          specularExponent="20"
          lightingColor="#ffffff"
          result="specular"
        >
          <fePointLight x="170" y="-50" z="150" />
        </feSpecularLighting>

        <feComponentTransfer in="specular" result="specular_faded">
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>

        <feBlend in="specular_faded" in2="saturated" mode="screen" />
      </filter>

      {/* Glow filter */}
      <filter id="logo-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="8" result="blur" />
      </filter>
    </defs>

    {/* Outer glow */}
    <g filter="url(#logo-glow)" className={styles.glowLayer}>
      <path
        d={logoPath}
        fill="none"
        stroke="url(#logo-bg-gradient)"
        strokeWidth="35"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <path d={dotPath} fill="url(#logo-bg-gradient)" opacity="0.4" />
    </g>

    {/* Main logo with liquid glass effect */}
    <g clipPath="url(#logo-clip)" filter="url(#logo-liquid)">
      <rect x="-50" y="-50" width="450" height="500" fill="url(#logo-bg-gradient)" />
    </g>

    {/* White rim */}
    <path
      className={styles.rimPath}
      d={logoPath}
      fill="none"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Dot rim */}
    <path
      className={styles.rimDot}
      d={dotPath}
      fill="none"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="2"
      transform="scale(1.08) translate(-8, -2)"
    />
  </svg>
);
