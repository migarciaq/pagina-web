import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Habilidades from './Habilidades.jsx';

const itemsA = [
  { categoria: 'Categoría Fixture Uno', items: ['Item Uno', 'Item Dos'] },
  { categoria: 'Categoría Fixture Dos', items: ['Item Tres'] },
];

const itemsB = [{ categoria: 'Categoría Fixture Tres', items: ['Item Cuatro', 'Item Cinco', 'Item Seis'] }];

describe('Habilidades section', () => {
  it('renders one heading and tag list per skill category, with all items inside', () => {
    render(<Habilidades items={itemsA} />);

    expect(screen.getByRole('heading', { name: 'Habilidades' })).toBeInTheDocument();
    expect(screen.getByText(itemsA[0].categoria)).toBeInTheDocument();
    expect(screen.getByText(itemsA[1].categoria)).toBeInTheDocument();

    const allSkillTags = screen.getAllByRole('listitem');
    const expectedTagCount = itemsA.reduce((sum, category) => sum + category.items.length, 0);
    expect(allSkillTags).toHaveLength(expectedTagCount);

    expect(screen.getByText('Item Uno')).toBeInTheDocument();
    expect(screen.getByText('Item Tres')).toBeInTheDocument();
  });

  it('renders a different category/tag count for a different fixture, proving output is prop-driven', () => {
    render(<Habilidades items={itemsB} />);

    const allSkillTags = screen.getAllByRole('listitem');
    expect(allSkillTags).toHaveLength(3);
    expect(screen.getByText(itemsB[0].categoria)).toBeInTheDocument();
  });

  it('exposes itself as an accessible landmark region labeled "Habilidades" with id="habilidades"', () => {
    render(<Habilidades items={itemsA} />);

    const region = screen.getByRole('region', { name: 'Habilidades' });
    expect(region).toHaveAttribute('id', 'habilidades');
  });
});
