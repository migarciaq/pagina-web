import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section ids is currently most visible in the
 * viewport, using IntersectionObserver. Adapted from the vanilla
 * `initScrollSpy` behavior in the pre-migration script.js as a React hook
 * with observer cleanup on unmount.
 *
 * @param {string[]} sectionIds
 * @param {{ threshold?: number, rootMargin?: string }} [options]
 * @returns {string | null} id of the currently active section, or null
 */
export function useScrollSpy(sectionIds, options = {}) {
  const [activeId, setActiveId] = useState(null);
  const { threshold = 0.35, rootMargin = '-10% 0px -40% 0px' } = options;
  const key = sectionIds.join(',');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || sectionIds.length === 0) {
      return undefined;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, threshold, rootMargin]);

  return activeId;
}
