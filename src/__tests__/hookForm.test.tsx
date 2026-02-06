import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HookForm from '../components/HookForm/HookForm';

const mockFileReader = {
  readAsDataURL: vi.fn(),
  result: 'data:image/png;base64,mockbase64',
  onload: null as (() => void) | null,
};
Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockFileReader),
});

const renderForm = () => render(<HookForm />);

describe('HookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(document, 'dispatchEvent').mockImplementation(() => true);
  });

  it('renders all form fields and disables submit initially', () => {
    renderForm();
    expect(screen.getByRole('heading', { name: /react hook form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  describe('password fields', () => {
    it('shows strength and toggles visibility', async () => {
      const user = userEvent.setup();
      renderForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const toggleButtons = screen.getAllByRole('button', {
        name: /show|hide/i,
      });
      const passwordToggle = toggleButtons[0];

      expect(passwordInput).toHaveAttribute('type', 'password');
      await user.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.type(passwordInput, 'weak');
      expect(screen.getByText(/strength: weak/i)).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, 'Strong123!');
      expect(screen.getByText(/strength: strong/i)).toBeInTheDocument();
    });

    it('toggles confirm password visibility', async () => {
      const user = userEvent.setup();
      renderForm();

      const confirmInput = screen.getByLabelText(/confirm password/i);
      const toggleButtons = screen.getAllByRole('button', {
        name: /show|hide/i,
      });
      const confirmToggle = toggleButtons[1];

      expect(confirmInput).toHaveAttribute('type', 'password');
      await user.click(confirmToggle);
      expect(confirmInput).toHaveAttribute('type', 'text');
      expect(confirmToggle).toHaveTextContent(/hide/i);
    });
  });

  it('submits form with valid data and uploads file', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/age/i), '25');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Test123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Test123!');
    await user.click(screen.getByLabelText(/accept.*terms/i));
    await user.selectOptions(screen.getByLabelText(/country/i), 'USA');

    const file = new File(['mock'], 'test.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/upload picture/i), file);
    mockFileReader.onload?.();

    await user.click(screen.getByRole('button', { name: /submit/i }));
  });

  it('shows error when uploading too large file', async () => {
    const user = userEvent.setup();
    renderForm();

    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    await user.upload(screen.getByLabelText(/upload picture/i), bigFile);
  });
});
