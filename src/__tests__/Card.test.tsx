import { render, screen } from '@testing-library/react';
import Card from '../components/Card/Card';

describe('Card component', () => {
  const props = {
    name: 'Charmander',
    description: 'A fire-type Pokémon',
    imageUrl: 'charmander.png',
  };

  it('renders the name and image', () => {
    render(<Card {...props} />);

    const image = screen.getByRole('img', { name: /charmander/i });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', props.imageUrl);
  });
});
