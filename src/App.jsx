import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import SkipLink from './components/layout/SkipLink.jsx';
import Contacto from './components/sections/Contacto.jsx';
import ExperienciaLaboral from './components/sections/ExperienciaLaboral.jsx';
import Formacion from './components/sections/Formacion.jsx';
import Habilidades from './components/sections/Habilidades.jsx';
import Perfil from './components/sections/Perfil.jsx';
import { cv } from './data/cv.js';
import { navigationItems } from './data/navigation.js';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <SkipLink targetId="main-content" />
      <Header items={navigationItems} />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Perfil {...cv.perfil} />
        <Formacion items={cv.formacion} />
        <ExperienciaLaboral items={cv.experiencia} />
        <Habilidades items={cv.habilidades} />
        <Contacto {...cv.contacto} />
      </main>

      <Footer />
    </div>
  );
}
