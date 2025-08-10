import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import PokemonDetails from '../components/PokemonDetails/PokemonDetails';
import { usePokemonDetails } from '../queries/pokemonQueries';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../queries/pokemonQueries', () => ({
  usePokemonDetails: vi.fn(),
}));

function renderWithClient(ui: React.ReactElement) {
  const testClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={testClient}>{ui}</QueryClientProvider>
  );
}

type UsePokemonDetailsReturn = ReturnType<typeof usePokemonDetails>;

const mockPikachuData = {
  id: 25,
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: 'pikachu.png' },
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
  stats: [
    { stat: { name: 'hp' }, base_stat: 35 },
    { stat: { name: 'attack' }, base_stat: 55 },
    { stat: { name: 'defense' }, base_stat: 40 },
  ],
};

describe('PokemonDetails', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when data is loading', () => {
    vi.mocked(usePokemonDetails).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as UsePokemonDetailsReturn);

    renderWithClient(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders pokemon details correctly when data is loaded', () => {
    vi.mocked(usePokemonDetails).mockReturnValue({
      data: mockPikachuData,
      isLoading: false,
      error: null,
    } as unknown as UsePokemonDetailsReturn);

    renderWithClient(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });
});
