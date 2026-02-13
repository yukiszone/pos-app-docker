import { render, screen } from '@testing-library/react';
import App from './App';

// Disabilitiamo temporaneamente i log degli errori di Axios in console
// visto che nei test il server backend non è acceso.
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