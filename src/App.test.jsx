import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';
import { navigationItems } from './data/navigation.js';

describe('App shell', () => {
  it('renders one landmark section per navigation item, in navigation order', () => {
    render(<App />);

    const regions = screen.getAllByRole('region');

    expect(regions).toHaveLength(navigationItems.length);
    regions.forEach((region, index) => {
      expect(region).toHaveAttribute('id', navigationItems[index].id);
    });
  });

  it('renders one nav link per section with an href matching the section id', () => {
    render(<App />);

    const nav = screen.getByRole('navigation', { name: /principal/i });
    const links = within(nav).getAllByRole('link');

    expect(links).toHaveLength(navigationItems.length);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `#${navigationItems[index].id}`);
    });
  });

  it('does not render publications, projects, teaching-experience, or language-table content', () => {
    render(<App />);

    // Section/subsection headings only — a job title like "Administrativa en
    // Proyecto" legitimately contains "Proyecto" (singular) without this
    // being a "Proyectos" (portfolio) section, so headings are matched
    // against the out-of-scope topic names rather than arbitrary body text.
    const headingText = screen.getAllByRole('heading').map((heading) => heading.textContent);

    expect(headingText.some((text) => /publicaci(ó|o)n/i.test(text))).toBe(false);
    expect(headingText.some((text) => /proyectos/i.test(text))).toBe(false);
    expect(headingText.some((text) => /docencia/i.test(text))).toBe(false);
    expect(headingText.some((text) => /experiencia (laboral )?docente/i.test(text))).toBe(false);
    expect(headingText.some((text) => /idiomas/i.test(text))).toBe(false);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
