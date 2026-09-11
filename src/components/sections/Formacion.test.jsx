import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Formacion from './Formacion.jsx';

const itemsA = [
  { titulo: 'Título Fixture Uno', institucion: 'Institución Fixture A', periodo: '01/2020', estado: 'Graduada' },
  { titulo: 'Título Fixture Dos', institucion: 'Institución Fixture B', periodo: '02/2021', estado: 'En curso' },
];

const itemsB = [
  { titulo: 'Curso Fixture Tres', institucion: 'Institución Fixture C', periodo: '03/2022', estado: 'Educación informal' },
  { titulo: 'Curso Fixture Cuatro', institucion: 'Institución Fixture D', periodo: '04/2022', estado: 'Educación informal' },
  { titulo: 'Curso Fixture Cinco', institucion: 'Institución Fixture E', periodo: '05/2022', estado: 'Educación informal' },
];

describe('Formacion section', () => {
  it('renders one list item per formacion entry with its título and período', () => {
    render(<Formacion items={itemsA} />);

    expect(screen.getByRole('heading', { name: 'Formación' })).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(itemsA.length);

    listItems.forEach((item, index) => {
      expect(within(item).getByText(itemsA[index].titulo)).toBeInTheDocument();
      expect(within(item).getByText(itemsA[index].periodo)).toBeInTheDocument();
    });
  });

  it('renders a different item count for a different fixture, proving the list is prop-driven', () => {
    render(<Formacion items={itemsB} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(itemsB.length);
    expect(screen.getByText(itemsB[2].titulo)).toBeInTheDocument();
  });

  it('exposes itself as an accessible landmark region labeled "Formación" with id="formacion"', () => {
    render(<Formacion items={itemsA} />);

    const region = screen.getByRole('region', { name: 'Formación' });
    expect(region).toHaveAttribute('id', 'formacion');
  });
});
