import styles from './Section.module.css';

/**
 * Shared landmark wrapper for top-level CV content sections. `landmarkLabel`
 * sets the accessible name of the `region` landmark (kept in sync with
 * `src/data/navigation.js` labels so scroll-spy/App tests stay stable);
 * `heading` is the visible section title, which may differ (e.g. the
 * "Experiencia" landmark shows the "Experiencia Laboral" heading).
 */
export default function Section({ id, landmarkLabel, heading, children }) {
  return (
    <section id={id} aria-label={landmarkLabel} className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>{heading}</h2>
        {children}
      </div>
    </section>
  );
}
