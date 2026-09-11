import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copyright}>&copy; {year} Portafolio profesional.</p>

        <div className={styles.links}>
          <a href="#hero" className={styles.link}>
            Volver al inicio &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
