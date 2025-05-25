import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext'; 
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext(); // 🔥 read searchQuery from AppContext
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16 flex flex-col px-4 md:px-8">
      
      {/* Title and Search */}
      <div className="flex flex-col items-end w-max self-end mb-6">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.filter(product => product.in_stock).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      
    </div>
  );
};

export default AllProducts;
