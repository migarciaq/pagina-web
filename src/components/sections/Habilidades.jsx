import Tag from '../ui/Tag.jsx';
import Section from '../ui/Section.jsx';
import styles from './Habilidades.module.css';

export default function Habilidades({ items = [] }) {
  return (
    <Section id="habilidades" landmarkLabel="Habilidades" heading="Habilidades">
      <div className={styles.categories}>
        {items.map((category) => (
          <div key={category.categoria} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category.categoria}</h3>
            <ul className={styles.tagList}>
              {category.items.map((skill) => (
                <li key={skill} className={styles.tagItem}>
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
