import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

test('Renderizza la navbar con i link corretti', () => {
  render(<App />);
  
  const brandElement = screen.getByText(/CASSA/i);
  expect(brandElement).toBeInTheDocument();

  const venditaLink = screen.getByText(/Vendita/i);
  const prodottiLink = screen.getByText(/Prodotti/i);
  const resocontoLink = screen.getByText(/Resoconto/i);

  expect(venditaLink).toBeInTheDocument();
  expect(prodottiLink).toBeInTheDocument();
  expect(resocontoLink).toBeInTheDocument();
});