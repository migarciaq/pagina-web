import TimelineItem from '../ui/TimelineItem.jsx';
import Section from '../ui/Section.jsx';
import styles from './Formacion.module.css';

export default function Formacion({ items = [] }) {
  return (
    <Section id="formacion" landmarkLabel="Formación" heading="Formación">
      <ul className={styles.list}>
        {items.map((item, index) => (
          <TimelineItem
            key={`${item.titulo}-${index}`}
            title={item.titulo}
            subtitle={item.institucion || undefined}
            period={item.periodo}
            tag={item.estado}
          />
        ))}
      </ul>
    </Section>
  );
}
