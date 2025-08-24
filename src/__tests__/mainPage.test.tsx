import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React, { FC } from 'react';
import MainPage from '../components/MainPage/MainPage';

const mockMarkAsRead = vi.fn();

vi.mock('../store/index', () => ({
  useFormStore: vi.fn(() => ({
    forms: [
      {
        id: 1,
        name: 'John',
        age: 25,
        email: 'john@example.com',
        gender: 'male',
        country: 'USA',
        acceptTerms: true,
        picture: 'mock.png',
        isNew: true,
      },
    ],
    markAsRead: mockMarkAsRead,
  })),
}));

vi.mock('../components/UncontrolledForm/UncontrolledForm', () => ({
  default: (() => <div>UncontrolledForm Mock</div>) as FC<{
    focusRef?: React.Ref<HTMLInputElement>;
  }>,
}));

vi.mock('../components/HookForm/HookForm', () => ({
  default: (() => <div>HookForm Mock</div>) as FC<{
    focusRef?: React.Ref<HTMLInputElement>;
  }>,
}));

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders buttons and opens modals', async () => {
    const user = userEvent.setup();
    render(<MainPage />);

    const uncontrolledBtn = screen.getByRole('button', {
      name: /open uncontrolled form/i,
    });
    const hookBtn = screen.getByRole('button', {
      name: /open react hook form/i,
    });

    expect(uncontrolledBtn).toBeInTheDocument();
    expect(hookBtn).toBeInTheDocument();

    await user.click(uncontrolledBtn);

    await user.click(hookBtn);
  });
});
