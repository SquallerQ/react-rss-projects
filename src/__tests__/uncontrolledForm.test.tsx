import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UncontrolledForm from '../components/UncontrolledForm/UncontrolledForm';

describe('UncontrolledForm', () => {
  it('renders all fields', () => {
    render(<UncontrolledForm />);
    [
      /name/i,
      /age/i,
      /email/i,
      /^password$/i,
      /confirm password/i,
      /female/i,
      /accept.*terms/i,
      /upload picture/i,
      /country/i,
    ].forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /uncontrolled form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const showBtn = screen.getAllByRole('button').find((b) => b.textContent === 'Show');
    expect(passwordInput.type).toBe('password');
    if (showBtn) {
      await user.click(showBtn);
      expect(passwordInput.type).toBe('text');
      await user.click(screen.getByRole('button', { name: /hide/i }));
      expect(passwordInput.type).toBe('password');
    }
  });

  it('shows password strength', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);
    const input = screen.getByLabelText(/^password$/i);
    await user.type(input, 'weak');
    expect(screen.getByText(/strength: weak/i)).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'medium123');
    expect(screen.getByText(/strength: medium/i)).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'Strong123!');
    expect(screen.getByText(/strength: strong/i)).toBeInTheDocument();
  });

  it('validates empty submission', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('toggles confirm password visibility', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm />);
    const confirmInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const toggleBtn = screen.getAllByRole('button', { name: /show/i })[1];
    expect(confirmInput.type).toBe('password');
    await user.click(toggleBtn);
    expect(confirmInput.type).toBe('text');
    await user.click(toggleBtn);
    expect(confirmInput.type).toBe('password');
  });
});
