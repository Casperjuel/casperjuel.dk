import styles from "./GlassFrame.module.scss";

export const GlassFrame = () => {
  return (
    <div className={styles.frameContainer}>
      <div className={styles.glow} />
      <div className={styles.border} />
      <div className={styles.innerShadow} />
    </div>
  );
};
