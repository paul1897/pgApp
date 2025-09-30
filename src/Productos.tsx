import React from 'react';

export interface Item {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
}
 
interface ProductsProps {
  items: Item[];
}

const Products: React.FC<ProductsProps> = ({ items }) => {
  return (
    <div className="item-list">
      {items.map(item => (
        <div key={item.id} className="item-card">
          {item.thumbnail && (
            <img src={item.thumbnail} alt={item.title} width={150} height={150} />
          )}
          <h2>{item.title}</h2>
          <p>Categoria: {item.category}</p>
          <p>Precio: ${item.price}</p>
          <p>Rating: {item.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
