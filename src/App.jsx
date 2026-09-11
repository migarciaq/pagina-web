import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import SkipLink from './components/layout/SkipLink.jsx';
import { navigationItems } from './data/navigation.js';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <SkipLink targetId="main-content" />
      <Header items={navigationItems} />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        {navigationItems.map((item) => (
          <section key={item.id} id={item.id} aria-label={item.label} className={styles.section} />
        ))}
      </main>

      <Footer />
    </div>
  );
}
