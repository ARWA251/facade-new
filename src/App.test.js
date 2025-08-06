import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const heading = screen.getByText(/FACADE 1/i);
  expect(heading).toBeInTheDocument();
});

test('renders image upload control', () => {
  render(<App />);
  const imageButton = screen.getByLabelText(/Image/i);
  expect(imageButton).toBeInTheDocument();
});
