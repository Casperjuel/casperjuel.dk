# Scroll-Animated Personal Site Plan

## Overview
Transform casperjuel.dk into a scroll-animated showcase with liquid glass effects. Minimal 4-section layout with placeholder content. GlassFrame stays fixed, content flows through it.

## Design Philosophy
- **Late 2025 aesthetic**: Liquid glass, bold gradients, depth, dimensionality
- **Crisp but playful**: Sharp typography with animated flourishes
- **Rich in detail**: Layered effects, micro-interactions, parallax
- **Scroll-driven**: Content reveals tied to scroll position using Framer Motion

---

## Site Structure (4 Sections)

### Section 1: Hero (0vh - 100vh)
- Your name "Casper Juel" in large GlassText
- Subtitle: "Creative Developer" animates in
- GlassPills float in background
- Scroll indicator arrow bouncing at bottom
- Logo in top-right (existing)

### Section 2: About (100vh - 200vh)
- Large statement that animates word-by-word: "I build things for the web that feel alive"
- Brief bio paragraph fades in below
- Floating glass orbs in parallax background

### Section 3: Skills & Experience (200vh - 350vh)
- Glass cards for skill categories (Frontend, Creative Coding, Tools)
- Cards animate in staggered as you scroll
- Current role highlight: "Currently @ Signifly"

### Section 4: Contact (350vh - 400vh)
- "Let's connect" heading
- Social links with glass pill styling
- Subtle floating elements

---

## Technical Approach

### Scroll Animation System
Framer Motion's `useScroll` + `useTransform`:
```tsx
const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
```

### New Components

1. **ScrollSection** - Wrapper with scroll-triggered animations
2. **AnimatedText** - Word-by-word or letter reveal on scroll
3. **GlassCard** - Card using GlassEffect styling for skills
4. **ScrollIndicator** - Bouncing arrow at hero bottom

### Files to Create/Modify

| File | Action |
|------|--------|
| `pages/index.tsx` | Rewrite for scroll sections |
| `styles/home.module.scss` | Update for scroll layout |
| `src/components/ScrollSection/` | New - section wrapper |
| `src/components/AnimatedText/` | New - scroll text reveal |
| `src/components/GlassCard/` | New - skill cards |
| `src/components/ScrollIndicator/` | New - scroll prompt |

---

## Animation Details

### Text
- **Hero name**: Existing GlassText with float animation
- **Statements**: Word-by-word opacity reveal tied to scroll %
- **Paragraphs**: Fade + translateY from 20px → 0

### Glass Elements
- **Orbs**: Parallax at 0.5x and 1.5x scroll speed
- **Cards**: Scale 0.95 → 1 + opacity 0 → 1
- **Frame**: Keep existing scroll-reactive behavior

### Section Transitions
- Continuous scroll (no snap)
- Previous section content fades as next enters
- Overlap zones for smooth handoff

---

## Implementation Steps

1. ✅ Plan approved
2. Set up scroll container structure in index.tsx
3. Create ScrollSection component
4. Create AnimatedText component
5. Create GlassCard component
6. Create ScrollIndicator component
7. Build Hero section
8. Build About section
9. Build Skills section
10. Build Contact section
11. Add parallax floating orbs
12. Polish timing and easing
13. Mobile responsiveness

---

## Placeholder Content

**Hero:**
- Name: "Casper Juel"
- Role: "Creative Developer"

**About:**
- Statement: "I build things for the web that feel alive"
- Bio: "Developer with a passion for creative coding, motion, and crafting digital experiences that push boundaries. Currently based in Copenhagen."

**Skills:**
- Frontend: React, Next.js, TypeScript, CSS/SCSS
- Creative: Three.js, WebGL, Framer Motion, p5.js
- Tools: Figma, Git, Node.js

**Contact:**
- Links: GitHub, Instagram, LinkedIn (existing)
