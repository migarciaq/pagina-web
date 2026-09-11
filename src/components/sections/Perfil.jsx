import Section from '../ui/Section.jsx';
import styles from './Perfil.module.css';

export default function Perfil({ nombre, titular, ubicacion, resumen, experienciaTotal }) {
  return (
    <Section id="perfil" landmarkLabel="Perfil" heading="Perfil">
      <div className={styles.content}>
        <h3 className={styles.nombre}>{nombre}</h3>
        <p className={styles.titular}>{titular}</p>
        {ubicacion ? <p className={styles.ubicacion}>{ubicacion}</p> : null}
        <p className={styles.resumen}>{resumen}</p>
        {experienciaTotal ? <p className={styles.experienciaTotal}>{experienciaTotal}</p> : null}
      </div>
    </Section>
  );
}
