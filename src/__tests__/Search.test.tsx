import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Search from '../components/Search/Search';

describe('Search Component', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders input and search button', () => {
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays saved search term from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('pikachu');
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/search pokémon/i)).toHaveValue(
      'pikachu'
    );
  });

  it('displays empty input when no saved term exists', () => {
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/search pokémon/i)).toHaveValue('');
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    expect(input).toHaveValue('bulbasaur');
  });

  it('saves trimmed search term to localStorage and calls onSearch on search button click', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search pokémon/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pikachu  ' } });
    fireEvent.click(searchButton);

    expect(localStorage.setItem).toHaveBeenCalledWith('searchTerm', 'pikachu');
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('shows reset button when inputValue is not empty', () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/search pokémon/i);

    expect(screen.queryByTitle(/reset search/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(screen.getByTitle(/reset search/i)).toBeInTheDocument();
  });

  it('clears input, localStorage, and calls onSearch on reset button click', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search pokémon/i);

    fireEvent.change(input, { target: { value: 'pikachu' } });
    const resetButton = screen.getByTitle(/reset search/i);

    fireEvent.click(resetButton);

    expect(input).toHaveValue('');
    expect(localStorage.removeItem).toHaveBeenCalledWith('searchTerm');
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
