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
});
