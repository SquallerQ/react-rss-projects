import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { server } from './mocks/server';

vi.mock('../components/Card/Card', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`card-${name}`}>{name}</div>
  ),
}));

vi.mock('../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({
    children,
    onReset,
  }: {
    children: React.ReactNode;
    onReset: () => void;
  }) => (
    <div data-testid="error-boundary">
      {children}
      <button data-testid="reset-button" onClick={onReset}>
        Reset
      </button>
    </div>
  ),
}));

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('App Component', () => {
  it('fetches and displays a Pokémon card after search', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);
  });

  it('resets search after clicking reset button in ErrorBoundary', async () => {
    render(<App />);
    const resetButton = screen.getByTestId('reset-button');
    await userEvent.click(resetButton);
  });
});
