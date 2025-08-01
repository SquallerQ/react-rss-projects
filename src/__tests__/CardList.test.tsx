import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import CardList from '../components/CardList/CardList';
import { server } from './mocks/server';
import { http } from 'msw';

vi.mock('../components/Card/Card', () => ({
  default: ({
    name,
    description,
    imageUrl,
  }: {
    name: string;
    description: string;
    imageUrl: string;
  }) => (
    <div data-testid={`card-${name}`}>
      {name} - {description} - {imageUrl}
    </div>
  ),
}));

vi.mock('../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const pikachuData = {
  id: 25,
  name: 'pikachu',
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: 'pikachu.png' },
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
};

const pikachuListResponse = {
  count: 100,
  results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
};

const noPokemonResponse = { count: 0, results: [] };
const mockSetSearchParams = vi.fn();

function renderCardList(
  searchTerm = '',
  initialEntries = ['/page/1'],
  searchParams = new URLSearchParams({ page: '1' })
) {
  vi.mocked(useSearchParams).mockReturnValue([
    searchParams,
    mockSetSearchParams,
  ]);
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CardList searchTerm={searchTerm} />
    </MemoryRouter>
  );
}

describe('CardList Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders Spinner during loading', () => {
    renderCardList();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders single pokemon when searchTerm is provided', async () => {
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon/pikachu',
        () => new Response(JSON.stringify(pikachuData), { status: 200 })
      )
    );
    renderCardList('pikachu');
    await waitFor(() => {
      expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
    });
  });

  it('renders error message when API returns 404', async () => {
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon/unknown',
        () => new Response(null, { status: 404 })
      )
    );
    renderCardList('unknown');
    await waitFor(() => {
      expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
    });
  });

  it('renders "No Pokémon found" when API returns empty list', async () => {
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon',
        () => new Response(JSON.stringify(noPokemonResponse), { status: 200 })
      )
    );
    renderCardList();
    await waitFor(() => {
      expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
    });
  });

  it('updates URL with pokemonId when card is clicked', async () => {
    server.use(
      http.get(
        'https://pokeapi.co/api/v2/pokemon',
        () => new Response(JSON.stringify(pikachuListResponse), { status: 200 })
      ),
      http.get(
        'https://pokeapi.co/api/v2/pokemon/25',
        () => new Response(JSON.stringify(pikachuData), { status: 200 })
      )
    );
    renderCardList('', ['/page/1'], new URLSearchParams({ page: '1' }));
    await waitFor(() => {
      expect(screen.getByTestId('card-pikachu')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('card-pikachu'));
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: '1',
      pokemonId: '25',
    });
  });
});
