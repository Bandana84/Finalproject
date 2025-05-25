import React from 'react';
import { features } from '../assets/assets';

const BottomBanner = () => {
  const handleFeatureClick = (feature) => {
    // Add your feature click handler logic here
    console.log('Feature clicked:', feature.title);
  };

  return (
    <div className="relative w-full mt-24">
      {/* Mobile Banner */}
      <div className="md:hidden">
        <img 
          src="/bottom_banner_image_sm.png" 
          alt="banner" 
          className="w-full h-[300px] object-cover rounded-2xl shadow-lg"
        />
      </div>
      
      {/* Desktop Banner */}
      <div className="hidden md:block">
        <img 
          src="/bottom_banner_image.png" 
          alt="banner" 
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-20 md:pt-0 md:pr-24 px-6">
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full">
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary mb-6 md:mb-8 text-center md:text-right animate-fadeIn">
            Why We Are the Best?
          </h1>
          <div className="space-y-4 md:space-y-6">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => handleFeatureClick(feature)}
                className="flex items-start gap-4 md:gap-5 w-full p-4 md:p-3 rounded-xl transition-all duration-300 hover:bg-primary/10 active:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 md:w-10 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h3 className="text-base md:text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    {feature.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
