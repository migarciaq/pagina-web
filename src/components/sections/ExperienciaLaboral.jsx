import TimelineItem from '../ui/TimelineItem.jsx';
import Section from '../ui/Section.jsx';
import styles from './ExperienciaLaboral.module.css';

export default function ExperienciaLaboral({ items = [] }) {
  return (
    <Section id="experiencia" landmarkLabel="Experiencia" heading="Experiencia Laboral">
      <ul className={styles.list}>
        {items.map((item, index) => (
          <TimelineItem
            key={`${item.cargo}-${index}`}
            title={item.cargo}
            subtitle={item.organizacion}
            period={item.periodo}
            tag={item.sector}
            description={item.descripcion}
          />
        ))}
      </ul>
    </Section>
  );
}
