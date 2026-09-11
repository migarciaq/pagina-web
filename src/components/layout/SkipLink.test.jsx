import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SkipLink from './SkipLink.jsx';

describe('SkipLink', () => {
  it('renders as an anchor targeting the main content region', () => {
    render(<SkipLink targetId="main-content" />);

    const skipLink = screen.getByRole('link', { name: /saltar al contenido principal/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('moves focus to the main content region when activated', () => {
    render(
      <>
        <SkipLink targetId="main-content" />
        <main id="main-content" tabIndex={-1}>
          Contenido
        </main>
      </>
    );

    const skipLink = screen.getByRole('link', { name: /saltar al contenido principal/i });
    fireEvent.click(skipLink);

    expect(screen.getByText('Contenido')).toHaveFocus();
  });
});
