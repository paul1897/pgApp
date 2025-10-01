import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Paginacion from './Paginacion';
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, title: 'Sartén', category: 'Cocina', price: 12.5, rating: 4.5 },
          { id: 2, title: 'Cuchillo', category: 'Cocina', price: 8.99, rating: 4.0 },
        ]),
    })
  ) as jest.Mock;
});

describe('App component', () => {
  it('renders App component', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Sartén/i)).toBeInTheDocument();
    });
  });

  it('busca un elemento y muestra solo los productos coincidentes', async () => {
    render(<App />);
  
    const input = await screen.findByPlaceholderText(/Buscar productos/i);
    userEvent.type(input, 'Cuchillo');
  
    await waitFor(() => {
      expect(screen.getByText(/Cuchillo/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sartén/i)).not.toBeInTheDocument();
    });
  });
  

});

describe('Paginacion Component', () => {
    it('no renderiza nada si totalPages <= 1', () => {
      const mockGoToPage = jest.fn();
      const { container } = render(
        <Paginacion totalPages={1} currentPage={1} goToPage={mockGoToPage} />
      );
      expect(container.firstChild).toBeNull();
    });
  
    it('renderiza los botones correctos según totalPages', () => {
      const mockGoToPage = jest.fn();
      render(<Paginacion totalPages={3} currentPage={1} goToPage={mockGoToPage} />);
  
      // Deben existir los 3 botones
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
  
      // Verificamos que el botón activo es el actual
      expect(buttons[0]).toHaveClass('active');
      expect(buttons[1]).not.toHaveClass('active');
      expect(buttons[2]).not.toHaveClass('active');
    });
  
    it('llama a goToPage al hacer click en un botón', () => {
      const mockGoToPage = jest.fn();
      render(<Paginacion totalPages={3} currentPage={1} goToPage={mockGoToPage} />);
  
      const page2Button = screen.getByRole('button', { name: /Ir a la página 2/i });
      fireEvent.click(page2Button);
  
      expect(mockGoToPage).toHaveBeenCalledTimes(1);
      expect(mockGoToPage).toHaveBeenCalledWith(2);
    });
  });