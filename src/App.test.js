import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tailwind header', () => {
  render(<App />);
  const heading = screen.getByText(/hello tailwind css/i);
  expect(heading).toBeInTheDocument();
});
