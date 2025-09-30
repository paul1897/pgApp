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

  
  return (
    <div className="app">
      <h1>Productos de Cocina</h1>
      <Products items={filteredItems} />
    </div>
  );
}

export default App;
