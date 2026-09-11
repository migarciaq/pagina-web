import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Perfil from './Perfil.jsx';

const fixtureA = {
  nombre: 'Ada Fixture Lovelace',
  titular: 'Ingeniera de Pruebas',
  ubicacion: 'Ciudad Fixture, Colombia',
  email: 'ada@example.test',
  resumen: 'Resumen de prueba A para el perfil profesional.',
  experienciaTotal: '3 años 1 mes en el sector público · 0 años en el sector privado',
};

const fixtureB = {
  nombre: 'Grace Fixture Hopper',
  titular: 'Científica de Datos',
  ubicacion: 'Otra Ciudad, Colombia',
  email: 'grace@example.test',
  resumen: 'Resumen de prueba B, distinto del anterior, sobre otra trayectoria.',
  experienciaTotal: '5 años en el sector privado',
};

describe('Perfil section', () => {
  it('renders the provided name, headline, and summary as visible content', () => {
    render(<Perfil {...fixtureA} />);

    expect(screen.getByRole('heading', { name: 'Perfil' })).toBeInTheDocument();
    expect(screen.getByText(fixtureA.nombre)).toBeInTheDocument();
    expect(screen.getByText(fixtureA.titular)).toBeInTheDocument();
    expect(screen.getByText(fixtureA.resumen)).toBeInTheDocument();
    expect(screen.getByText(fixtureA.experienciaTotal)).toBeInTheDocument();
  });

  it('renders different content when given different props, proving output is prop-driven', () => {
    render(<Perfil {...fixtureB} />);

    expect(screen.getByText(fixtureB.nombre)).toBeInTheDocument();
    expect(screen.getByText(fixtureB.resumen)).toBeInTheDocument();
    expect(screen.queryByText(fixtureA.nombre)).not.toBeInTheDocument();
    expect(screen.queryByText(fixtureA.resumen)).not.toBeInTheDocument();
  });

  it('exposes itself as an accessible landmark region labeled "Perfil" with id="perfil"', () => {
    render(<Perfil {...fixtureA} />);

    const region = screen.getByRole('region', { name: 'Perfil' });
    expect(region).toHaveAttribute('id', 'perfil');
  });
});
