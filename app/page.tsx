"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Logo } from "../src/assets/logo";
import { GlassPills } from "../src/components/GlassPills/GlassPills";
import { GlassFrame } from "../src/components/GlassFrame/GlassFrame";
import { MobileGradient } from "../src/components/MobileGradient/MobileGradient";
import { ScrollSection } from "../src/components/ScrollSection/ScrollSection";
import { AnimatedText } from "../src/components/AnimatedText/AnimatedText";
import { GlassCard } from "../src/components/GlassCard/GlassCard";
import { ScrollIndicator } from "../src/components/ScrollIndicator/ScrollIndicator";
import { SignatureName } from "../src/components/SignatureName/SignatureName";
import { GlassButton } from "../src/components/GlassButton/GlassButton";
import { ThemeSwitcher } from "../src/components/ThemeSwitcher/ThemeSwitcher";
import styles from "../styles/home.module.scss";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <Logo />
      <ThemeSwitcher />
      <GlassFrame />
      <GlassPills />
      <MobileGradient />

      <main className={styles.main}>
        <motion.section className={styles.hero} style={{ opacity: heroOpacity }}>
          <div className={styles.heroContent}>
            <SignatureName />
            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5, duration: 0.8 }}
            >
              UI + Code in Copenhagen
            </motion.p>
          </div>
          <ScrollIndicator />
        </motion.section>

        <ScrollSection id="about" className={styles.about}>
          <div className={styles.aboutContent}>
            <AnimatedText
              text="love for creating digital things with code"
              as="h2"
              stagger={0.06}
            />
            <motion.p
              className={styles.bio}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Creating things online for more than 13 years. I have a passion for digital design, code, and tech. Based in Copenhagen.
              Converting pixels to bits for <a href="https://www.signifly.com/">Signifly</a>.
            </motion.p>
          </div>
        </ScrollSection>

        <ScrollSection id="skills" className={styles.skills}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What I Do
          </motion.h2>
          <div className={styles.cardsGrid}>
            <GlassCard
              title="Core"
              items={["React & Next.js", "TypeScript", "SCSS Modules", "Tailwind"]}
              delay={0}
            />
            <GlassCard
              title="Craft"
              items={["Performance", "Accessibility", "Motion", "Testing"]}
              delay={0.1}
            />
            <GlassCard
              title="Scale"
              items={["E-commerce", "Production Apps", "CI/CD", "13+ Years"]}
              delay={0.2}
            />
          </div>
          <div className={styles.cardStack}>
            <GlassCard
              title="Core"
              items={["React & Next.js", "TypeScript", "SCSS Modules", "Tailwind"]}
              index={0}
            />
            <GlassCard
              title="Craft"
              items={["Performance", "Accessibility", "Motion", "Testing"]}
              index={1}
            />
            <GlassCard
              title="Scale"
              items={["E-commerce", "Production Apps", "CI/CD", "13+ Years"]}
              index={2}
            />
          </div>
        </ScrollSection>

        <section id="contact" className={styles.contact}>
          <div className={styles.contactInner}>
            <motion.h2
              className={styles.contactTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Let's Connect
            </motion.h2>
            <nav className={styles.links} aria-label="Social links">
              <GlassButton href="https://github.com/casperjuel/" ariaLabel="Visit Casper Juel's GitHub profile">
                Github
              </GlassButton>
              <GlassButton href="https://www.instagram.com/casper.juel/" ariaLabel="Visit Casper Juel's Instagram profile">
                Instagram
              </GlassButton>
              <GlassButton href="https://www.linkedin.com/in/casperjuel" ariaLabel="Visit Casper Juel's LinkedIn profile">
                LinkedIn
              </GlassButton>
            </nav>

          </div>
        </section>
      </main>
    </>
  );
}
