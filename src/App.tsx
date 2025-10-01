import { useEffect, useRef, useState } from 'react';
import './App.css';
import Products from './Productos';
import Modal from './Modal';
import type { Item } from './Productos';
import Paginacion from './Paginacion';

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

  // favoritos persistentes
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // toggle favoritos
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // mostrar solo favoritos o todos
  const [showFavorites, setShowFavorites] = useState(false);
  const displayedItems = showFavorites
    ? filteredItems.filter(item => favorites.includes(item.id))
    : filteredItems;
    
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

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8; // muestra 5 por página
// calcular índices
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = displayedItems.slice(indexOfFirstItem, indexOfLastItem);
// total de páginas
const totalPages = Math.ceil(displayedItems.length / itemsPerPage);
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

        {/* label + input */}
        <div className="search-group">
          <label htmlFor="search-input" className="visually-hidden">
            Buscar productos
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar productos"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar productos"
            aria-describedby="search-feedback"
          />
          <button onClick={() => setSearch('')} className="btn-small" aria-label="Limpiar búsqueda">
            Limpiar
          </button>
        </div>

        {/* feedback */}
        <div id="search-feedback" aria-live="polite" className="sr-aria-live">
          {displayedItems.length === 0
            ? 'No se encontraron productos'
            : `${displayedItems.length} producto(s) encontrados`}
        </div>

        {/* toggle favoritos */}
        <div className="favorites-toggle" style={{ marginTop: '0.5rem' }}>
          <button onClick={() => setShowFavorites(false)} className="btn-small">
            Todos
          </button>
          <button onClick={() => setShowFavorites(true)} className="btn-small">
            Favoritos ({favorites.length})
          </button>
        </div>
      </header>
      <main aria-hidden={modalOpen ? 'true' : 'false'}>
        <Products items={currentItems} openModal={openModal} favorites={favorites} toggleFavorite={toggleFavorite}    isFirstPage={currentPage === 1}/>
      </main>

      {modalOpen && selectedItem && <Modal item={selectedItem} onClose={closeModal} />}
            {/* pagination */}
      <Paginacion
          totalPages={totalPages}
          currentPage={currentPage}
          goToPage={goToPage}/>
    </div>
  );
}
export default App;
