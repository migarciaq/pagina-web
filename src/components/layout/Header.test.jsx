import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Header from './Header.jsx';
import styles from './Header.module.css';

const items = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'contacto', label: 'Contacto' },
];

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

describe('Header', () => {
  afterEach(() => {
    setScrollY(0);
  });

  it('has no sticky class before the page scrolls past the threshold', () => {
    setScrollY(0);
    const { container } = render(<Header items={items} />);

    const header = container.querySelector('header');
    expect(header.className).not.toContain(styles.scrolled);
  });

  it('applies a sticky class once scrolled past the threshold', () => {
    const { container } = render(<Header items={items} />);

    setScrollY(200);
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header.className).toContain(styles.scrolled);
  });

  it('toggles the mobile menu open state on hamburger button activation', () => {
    const { container } = render(<Header items={items} />);

    const toggle = screen.getByRole('button', { name: /menú de navegación/i });
    const nav = screen.getByRole('navigation', { name: /principal/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(nav.className).not.toContain(styles.open);

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(nav.className).toContain(styles.open);

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(nav.className).not.toContain(styles.open);
    expect(container).toBeTruthy();
  });

  it('exposes the menu toggle as a native, keyboard-focusable button', () => {
    render(<Header items={items} />);

    const toggle = screen.getByRole('button', { name: /menú de navegación/i });
    expect(toggle.tagName).toBe('BUTTON');
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).not.toHaveAttribute('tabindex');
  });
});
