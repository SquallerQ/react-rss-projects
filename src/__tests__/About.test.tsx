import { render, screen } from '@testing-library/react';
import About from '../components/About/About';

describe('About Component', () => {
  it('renders the RS School course link', () => {
    render(<About />);
    const courseLink = screen.getByText('RS School React Course');
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute('href');
  });
});
