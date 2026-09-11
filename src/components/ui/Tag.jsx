import styles from './Tag.module.css';

/** Small pill used for a skill, an education status, or a sector label. */
export default function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
