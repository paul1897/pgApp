import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // React Router v6
import './App.css';
import Products from './Productos';
import Modal from './Modal';
import type { Item } from './Productos';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Favoritos persistentes
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Mostrar solo favoritos o todos
  const [showFavorites, setShowFavorites] = useState(false);

  // Leer parámetros de URL al cargar
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    setSearch(q);
    setCurrentPage(page);
  }, [searchParams]);

  // Actualizar URL al cambiar búsqueda o página
  useEffect(() => {
    const params: any = {};
    if (search) params.q = search;
    if (currentPage !== 1) params.page = currentPage;
    setSearchParams(params);
  }, [search, currentPage, setSearchParams]);

  // Cargar items
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

  // Debounce búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      const searchLower = search.trim().toLowerCase();
      const filtered = searchLower === ''
        ? items
        : items.filter(item => item.title.toLowerCase().includes(searchLower));
      setFilteredItems(filtered);
      setCurrentPage(1); // reset page al cambiar búsqueda
    }, 300);
    return () => clearTimeout(handler);
  }, [search, items]);

  // Items a mostrar (filtrados y favoritos)
  const displayedItems = showFavorites
    ? filteredItems.filter(item => favorites.includes(item.id))
    : filteredItems;

  // Paginación
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedItems.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Modal
  const openModal = (item: Item, triggerElement: HTMLElement | null) => {
    if (triggerElement) lastFocusedElement.current = triggerElement;
    setSelectedItem(item);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setTimeout(() => lastFocusedElement.current?.focus(), 0);
  };

  if (isLoading) return <p className="info">Cargando items...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="app">
      <header>
        <h1>Productos de Cocina</h1>

        <div className="search-group">
          <label htmlFor="search-input" className="visually-hidden">Buscar productos</label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar productos"
            aria-describedby="search-feedback"
          />
          <button onClick={() => setSearch('')} className="btn-small" aria-label="Limpiar búsqueda">
            Limpiar
          </button>
        </div>

        <div id="search-feedback" aria-live="polite" className="sr-aria-live">
          {displayedItems.length === 0
            ? 'No se encontraron productos'
            : `${displayedItems.length} producto(s) encontrados`}
        </div>

        <div className="favorites-toggle" style={{ marginTop: '0.5rem' }}>
          <button onClick={() => setShowFavorites(false)} className="btn-small">Todos</button>
          <button onClick={() => setShowFavorites(true)} className="btn-small">
            Favoritos ({favorites.length})
          </button>
        </div>
      </header>

      <main aria-hidden={modalOpen ? 'true' : 'false'}>
        <Products
          items={currentItems}
          openModal={openModal}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </main>

      {modalOpen && selectedItem && <Modal item={selectedItem} onClose={closeModal} />}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`btn-small ${currentPage === page ? 'active' : ''}`}
            aria-label={`Ir a la página ${page}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
