import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to the element in `ref` and adds
 * `visibleClass` once it enters the viewport, then stops observing it
 * (one-shot reveal, mirroring the vanilla `initScrollReveal` behavior).
 * Applies the visible state immediately when the user prefers reduced
 * motion, or when IntersectionObserver is unavailable.
 */
export function useScrollReveal(
  ref,
  { visibleClass = 'is-visible', threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add(visibleClass);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, visibleClass, threshold, rootMargin]);
}
