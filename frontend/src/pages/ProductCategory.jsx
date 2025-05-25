import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
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
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
    const { products } = useAppContext();
    const { category } = useParams();
    
    // Find the category display name
    const searchCategory = categories.find((item) => 
        item.path.toLowerCase() === category.toLowerCase() ||
        item.path.toLowerCase().replace(/-/g, '_') === category.toLowerCase()
    );
    
    // Filter products by category (support both formats)
    const filteredProducts = products.filter((product) => 
        product.category.toLowerCase() === category.toLowerCase() ||
        product.category.toLowerCase().replace(/_/g, '-') === category.toLowerCase()
    );

    return (
        <div className='mt-16'>
            {searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                    <div className="w-16 h-0.5 bg-primary rounded-full"></div>
                </div>
            )}
            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]'>
                    <p>No products found in this category</p>
                </div>
            )}
        </div>
    );
};

export default ProductCategory;
