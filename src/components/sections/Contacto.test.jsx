import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Contacto from './Contacto.jsx';

describe('Contacto section', () => {
  it('exposes the published email as a mailto link', () => {
    render(<Contacto email="fixture@example.test" ubicacion="Ciudad Fixture, Colombia" />);

    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'fixture@example.test' });
    expect(link).toHaveAttribute('href', 'mailto:fixture@example.test');
  });

  it('renders a different email/ubicación for a different fixture, proving output is prop-driven', () => {
    render(<Contacto email="otro@example.test" ubicacion="Otra Ciudad, Colombia" />);

    const link = screen.getByRole('link', { name: 'otro@example.test' });
    expect(link).toHaveAttribute('href', 'mailto:otro@example.test');
    expect(screen.getByText('Otra Ciudad, Colombia')).toBeInTheDocument();
  });

  it('does not render a submission form or third-party form service', () => {
    render(<Contacto email="fixture@example.test" ubicacion="Ciudad Fixture, Colombia" />);

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(document.querySelector('form')).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('exposes itself as an accessible landmark region labeled "Contacto" with id="contacto"', () => {
    render(<Contacto email="fixture@example.test" ubicacion="Ciudad Fixture, Colombia" />);

    const region = screen.getByRole('region', { name: 'Contacto' });
    expect(region).toHaveAttribute('id', 'contacto');
  });
});
