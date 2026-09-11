import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ExperienciaLaboral from './ExperienciaLaboral.jsx';

const itemsA = [
  {
    cargo: 'Cargo Fixture Uno',
    organizacion: 'Organización Fixture A',
    periodo: '01/2020 - 02/2021',
    sector: 'Público',
    descripcion: 'Dependencia Fixture A',
  },
  {
    cargo: 'Cargo Fixture Dos',
    organizacion: 'Organización Fixture B',
    periodo: '03/2021 - Actual',
    sector: 'Privado',
    descripcion: 'Dependencia Fixture B',
  },
];

const itemsB = [
  {
    cargo: 'Cargo Fixture Tres',
    organizacion: 'Organización Fixture C',
    periodo: '05/2022 - 06/2023',
    sector: 'Privado',
    descripcion: 'Dependencia Fixture C',
  },
];

describe('ExperienciaLaboral section', () => {
  it('renders one list item per experience entry with cargo, organización, período, and sector', () => {
    render(<ExperienciaLaboral items={itemsA} />);

    expect(screen.getByRole('heading', { name: 'Experiencia Laboral' })).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(itemsA.length);

    listItems.forEach((item, index) => {
      expect(within(item).getByText(itemsA[index].cargo)).toBeInTheDocument();
      expect(within(item).getByText(itemsA[index].organizacion)).toBeInTheDocument();
      expect(within(item).getByText(itemsA[index].periodo)).toBeInTheDocument();
      expect(within(item).getByText(itemsA[index].sector)).toBeInTheDocument();
    });
  });

  it('renders a different item count for a different fixture, proving the list is prop-driven', () => {
    render(<ExperienciaLaboral items={itemsB} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(itemsB.length);
    expect(screen.getByText(itemsB[0].cargo)).toBeInTheDocument();
  });

  it('exposes itself as an accessible landmark region labeled "Experiencia" (matching nav) with id="experiencia"', () => {
    render(<ExperienciaLaboral items={itemsA} />);

    const region = screen.getByRole('region', { name: 'Experiencia' });
    expect(region).toHaveAttribute('id', 'experiencia');
  });
});
