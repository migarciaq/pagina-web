import Section from '../ui/Section.jsx';
import styles from './Contacto.module.css';

export default function Contacto({ email, ubicacion }) {
  return (
    <Section id="contacto" landmarkLabel="Contacto" heading="Contacto">
      <div className={styles.content}>
        {ubicacion ? <p className={styles.ubicacion}>{ubicacion}</p> : null}
        <a className={styles.emailLink} href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </Section>
  );
}
