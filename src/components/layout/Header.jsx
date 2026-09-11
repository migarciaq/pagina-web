import { useEffect, useState } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy.js';
import styles from './Header.module.css';

const SCROLL_THRESHOLD = 8;

export default function Header({ items = [] }) {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(items.map((item) => item.id));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`.trim()}>
      <div className={`container ${styles.inner}`}>
        <a href="#hero" className={styles.brand} aria-label="Inicio">
          Portafolio
        </a>

        <button
          type="button"
          className={styles.navToggle}
          aria-controls="nav-menu"
          aria-expanded={isMenuOpen}
          aria-label="Alternar menú de navegación"
          onClick={toggleMenu}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>

        <nav
          id="nav-menu"
          className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`.trim()}
          aria-label="Navegación principal"
        >
          <ul className={styles.navList}>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${styles.navLink} ${activeId === item.id ? styles.navLinkActive : ''}`.trim()}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
