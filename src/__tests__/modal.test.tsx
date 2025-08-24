import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Modal from '../components/Modal/Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('closes modal when Escape key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when clicking on overlay', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    const content = screen.getByText('Modal Content');
    const overlay = content.closest('.modal-overlay');
    expect(overlay).toBeTruthy();

    if (overlay) {
      await user.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalled();
  });
});
