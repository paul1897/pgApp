import React, { memo } from 'react';

export type Item = {
    id: string;
    title: string;
    category: string;
    price: number;
    rating: number;
    thumbnail: string;
};

interface ProductsProps {
  items: Item[];
  openModal?: (item: Item, element: HTMLElement | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const Products = ({ items, openModal, favorites, toggleFavorite }: ProductsProps) => {
    return (
    <ul className="product-list" role="list">
      {items.map(item => (
        <li key={item.id} className="product-item">
          <div
            className="product-card"
            tabIndex={0} // permite foco con Tab
            onKeyDown={(e) => {
              // Enter abre el modal (si se pasó la función)
              if (e.key === 'Enter' && openModal) {
                openModal(item, e.currentTarget as HTMLElement);
              }
            }}
          >
            {/* imagen con dimensiones explícitas para evitar CLS */}
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                width={150}
                height={150}
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="img-placeholder" aria-hidden="true" />
            )}

            <div className="product-info">
              <h2 className="product-title">{item.title}</h2>
              <p className="product-category">{item.category}</p>
              <p className="product-price">${item.price.toFixed(2)}</p>
              <p className="product-rating">⭐ {item.rating}</p>
              <button
  onClick={() => toggleFavorite(item.id)}
  aria-label={favorites.includes(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
>
  {favorites.includes(item.id) ? '★' : '☆'}
</button>
              {/* botón visible para abrir modal (accesible por teclado y screen readers) */}
              <button
                type="button"
                onClick={(e) => openModal?.(item, e.currentTarget as HTMLElement)}
                aria-label={`Ver detalles de ${item.title}`}
                className="btn-primary"
              >
                Ver detalle
              </button>
              
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default memo(Products);
