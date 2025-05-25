import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
const categories = [
    { text: 'Fruits', image: '/categories/fruits.jpg', bgColor: 'from-green-50 to-green-100', path: 'fruits' },
    { text: 'Vegetables', image: '/categories/vegetables.jpg', bgColor: 'from-amber-50 to-amber-100', path: 'vegetables' },
    { text: 'Grains & Pulses', image: '/categories/seeds.jpg', bgColor: 'from-cyan-50 to-cyan-100', path: 'grains_pulses' },
    { text: 'Dairy Products', image: '/categories/cattleandsheep.jpg', bgColor: 'from-rose-50 to-rose-100', path: 'dairy_products' },
    { text: 'Fertilizers', image: '/categories/fertilizers.jpg', bgColor: 'from-orange-50 to-orange-100', path: 'fertilizers' },
    { text: 'Fishery', image: '/categories/fishery.jpg', bgColor: 'from-blue-50 to-blue-100', path: 'fishery' },
    { text: 'Flowers', image: '/categories/flowers.jpg', bgColor: 'from-pink-50 to-pink-100', path: 'flowers' },
    { text: 'Nursery Plants', image: '/categories/nurseryplants.jpg', bgColor: 'from-emerald-50 to-emerald-100', path: 'nursery_plants' },
    { text: 'Poultry Products', image: '/categories/poultryproducts.jpg', bgColor: 'from-amber-50 to-amber-100', path: 'poultry_products' },
    { text: 'Spices', image: '/categories/spices.jpg', bgColor: 'from-orange-50 to-orange-100', path: 'spices' },
    { text: 'Nuts & Dry Fruits', image: '/categories/nutsanddry.jpg', bgColor: 'from-indigo-50 to-indigo-100', path: 'nuts_dry_fruits' },
    { text: 'Oils & Ghee', image: '/categories/oils.jpg', bgColor: 'from-purple-50 to-purple-100', path: 'oils_ghee' },
    { text: 'Manure', image: '/categories/fertilizers.jpg', bgColor: 'from-red-50 to-red-100', path: 'manure' },
    { text: 'Coffee & Tea', image: '/categories/coffeeandtea.jpg', bgColor: 'from-teal-50 to-teal-100', path: 'coffee_tea' },
  ];

const AllProducts = () => {
    const { products } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    // Filter products based on selected category
    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    // Sort products based on selected option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    return (
        <div className="mt-16 px-4 md:px-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.path} value={category.path}>
                                {category.text}
                            </option>
                        ))}
                    </select>

                    {/* Sort Options */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="default">Sort By</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                    </select>
                </div>
            </div>

            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="text-gray-500 text-lg">No products found</p>
                </div>
            )}
        </div>
    );
};

export default AllProducts; 