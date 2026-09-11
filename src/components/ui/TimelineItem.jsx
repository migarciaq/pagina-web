import Card from './Card.jsx';
import Tag from './Tag.jsx';
import styles from './TimelineItem.module.css';

/**
 * One entry in a `Formacion` / `ExperienciaLaboral` list: a title, an
 * optional subtitle (institución/organización), a period, an optional tag
 * (estado/sector), and an optional description.
 */
export default function TimelineItem({ title, subtitle, period, tag, description }) {
  return (
    <li className={styles.item}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {tag ? <Tag>{tag}</Tag> : null}
        </div>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        <p className={styles.period}>{period}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </Card>
    </li>
  );
}
