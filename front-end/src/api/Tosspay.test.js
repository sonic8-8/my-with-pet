import { render, screen } from '@testing-library/react';
import Tosspay from './Tosspay';

test('renders learn react link', () => {
  render(<Tosspay />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
