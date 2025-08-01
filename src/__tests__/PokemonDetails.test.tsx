import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { http } from 'msw';
import { server } from './mocks/server';
import PokemonDetails from '../components/PokemonDetails/PokemonDetails';

const pikachuData = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: 'pikachu.png' },
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
};

describe('PokemonDetails Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('removes pokemonId from URL when details panel close button is clicked', async () => {
    const mockOnClose = vi.fn();
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon/25',
        () => new Response(JSON.stringify(pikachuData), { status: 200 })
      )
    );
    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);
    await waitFor(() => {
      expect(screen.getByText(/PIKACHU/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
