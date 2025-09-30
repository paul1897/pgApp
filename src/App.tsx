import { useEffect, useState } from 'react';
import './App.css';
import Products from './Productos';
import type { Item } from './Productos';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // items por página
  
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

  // Búsqueda con debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const searchLower = search.toLowerCase();
      setFilteredItems(
        items.filter(item => item.title.toLowerCase().includes(searchLower))
      );
      setCurrentPage(1); // volver a la primera página al filtrar
    }, 300); // debounce 300ms

    return () => clearTimeout(handler);
  }, [search, items]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (isLoading) return <p>Cargando items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <h1>Productos de Cocina</h1>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <Products items={currentItems} />

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
