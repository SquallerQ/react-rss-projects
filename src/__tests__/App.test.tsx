import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { server } from './mocks/server';
import { http } from 'msw';

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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  it('renders search input and spinner initially', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('fetches and displays a Pokémon card after search', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/pikachu', () => {
        return new Response(
          JSON.stringify({
            id: 25,
            name: 'pikachu',
            types: [{ type: { name: 'electric' } }],
            sprites: { front_default: 'pikachu.png' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    render(<App />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
    });
  });

  it('resets search after clicking reset button in ErrorBoundary', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/search pokémon/i);
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    const resetButton = screen.getByTestId('reset-button');
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByTestId('card-pikachu')).not.toBeInTheDocument();
    });
  });
});
