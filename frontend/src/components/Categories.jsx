import React from 'react';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { navigate } = useAppContext();

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

  return (
    <div className='mt-20 px-4 md:px-10 max-w-7xl mx-auto'>
      <div className='text-center mb-14'>
        <h2 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 mb-3'>
          Explore Categories
        </h2>
        <p className='text-gray-500 max-w-2xl mx-auto'>
          Discover our wide range of fresh farm products and agricultural supplies
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5'>
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
            className={`group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${category.bgColor} shadow-sm hover:shadow-lg transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:scale-[1.02]`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px]"></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
              {/* Image container with shine effect */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full bg-white/30 group-hover:bg-white/50 backdrop-blur-sm p-2 transition-all duration-500">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <img
                  src={category.image}
                  alt={category.text}
                  className='w-full h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-500'
                />
              </div>
              
              {/* Text with animated underline */}
              <div className="relative">
                <p className='text-sm md:text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300'>
                  {category.text}
                </p>
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-green-500 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-500"></span>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;