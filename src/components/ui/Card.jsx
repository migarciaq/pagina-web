import styles from './Card.module.css';

/** Generic surface card used to visually group a piece of content. */
export default function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
}
