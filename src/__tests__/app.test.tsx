import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

vi.mock('./components/MainPage/MainPage', () => ({
  default: () => <div>MainPage Component</div>,
}));

describe('App', () => {
  it('renders MainPage component', () => {
    render(<App />);
  });
});
