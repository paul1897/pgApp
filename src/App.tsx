import { useEffect, useRef, useState } from 'react';
import './App.css';
import Products from './Productos';
import Modal from './Modal';
import type { Item } from './Productos';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // to return focus after closing modal
  const lastFocusedElement = useRef<HTMLElement | null>(null);


  // Debounce handler ref (optional cleanup)
  useEffect(() => {
    fetch('/api/item.json')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setFilteredItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Búsqueda con debounce 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      const searchLower = search.trim().toLowerCase();
      if (searchLower === '') {
        setFilteredItems(items);
      } else {
        setFilteredItems(
          items.filter(item => item.title.toLowerCase().includes(searchLower))
        );
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search, items]);


  // dentro de App()

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // muestra 5 por página

// calcular índices
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

// total de páginas
const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
};

  // Open modal and save the element that triggered it (to restore focus later)
  const openModal = (item: Item, triggerElement: HTMLElement | null) => {
    if (triggerElement) lastFocusedElement.current = triggerElement;
    setSelectedItem(item);
    setModalOpen(true);
    // hide main content from screen readers while modal open (we set aria-hidden elsewhere)
  };

  // Close modal and restore focus to the element that opened it
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    // restore focus after a tick to ensure modal removed
    setTimeout(() => {
      lastFocusedElement.current?.focus();
    }, 0);
  };

  if (isLoading) return <p className="info">Cargando items...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="app">
      <header>
        <h1>Productos de Cocina</h1>
  
        {/* Label accesible + input */}
        <div className="search-group">
          <label htmlFor="search-input" className="visually-hidden">
            Buscar productos
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar productos"
            aria-describedby="search-feedback"
          />
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Limpiar búsqueda"
            className="btn-small"
          >
            Limpiar
          </button>
        </div>
  
        {/* feedback de búsqueda - aria-live polite */}
        <div
          id="search-feedback"
          aria-live="polite"
          className="sr-aria-live"
        >
          {filteredItems.length === 0
            ? 'No se encontraron productos'
            : `${filteredItems.length} producto(s) encontrados`}
        </div>
      </header>
  
      {/* cuando modalOpen true, marcamos el main como aria-hidden para lectores de pantalla */}
      <main aria-hidden={modalOpen ? 'true' : 'false'}>
        <Products items={currentItems} openModal={openModal} />
  
        {/* Paginación */}
        {totalPages > 1 && (
          <nav
            className="pagination"
            aria-label="Paginación de productos"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              «
            </button>
  
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
  
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
            >
              »
            </button>
          </nav>
        )}
      </main>
  
      {/* modal accesible */}
      {modalOpen && selectedItem && (
        <Modal item={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
  
}

export default App;
