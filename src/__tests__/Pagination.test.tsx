import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination/Pagination';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('Pagination Component', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: '1' }),
      mockSetSearchParams,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('updates URL when pagination button is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={100}
        onPageChange={(page) => {
          if (page >= 1 && page <= 100) {
            mockSetSearchParams({ page: page.toString() });
          }
        }}
        isVisible={true}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('2'));
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '2' });
  });
});
