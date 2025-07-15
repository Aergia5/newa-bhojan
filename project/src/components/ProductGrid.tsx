import React from 'react';
import ProductCard from './ProductCard';
import { Product, CartItem } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  title: string;
  id?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, title, id }) => {
  return (
    <section id={id || title.toLowerCase().replace(/\s+/g, '-')} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of authentic Newari dishes, 
            prepared with traditional recipes and the finest ingredients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;