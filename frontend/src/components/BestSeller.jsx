import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const Bestseller = () => {
  const { products } = useAppContext();

  // Function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Get random products using useMemo to prevent unnecessary re-renders
  const randomProducts = useMemo(() => {
    console.log('All products:', products); // Debug log
    if (!Array.isArray(products)) return [];
    
    // If products don't have in_stock property, just use all products
    const availableProducts = products.filter((product) => {
      if (product.in_stock !== undefined) {
        return product.in_stock;
      }
      return true; // If in_stock is undefined, include the product
    });
    
    console.log('Available products:', availableProducts); // Debug log
    const shuffled = shuffleArray(availableProducts).slice(0, 5);
    console.log('Random products:', shuffled); // Debug log
    return shuffled;
  }, [products]);

  return (
    <div className="mt-20 px-4 md:px-8">
      <p className="text-3xl md:text-4xl font-extrabold text-primary mb-8 text-center md:text-left animate-fadeIn">
        Best Sellers
      </p>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : randomProducts.length === 0 ? (
        <p className="text-center text-gray-500">Loading best sellers...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8">
          {randomProducts.map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              className="hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bestseller;
