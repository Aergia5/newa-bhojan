import React from 'react';

interface HeroProps {
  onViewMenu?: () => void;
  onOrderNow?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onViewMenu, onOrderNow }) => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Authentic
              <span className="text-red-600 block">Newari Cuisine</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Experience the rich heritage of Newari food culture with our traditional recipes 
              passed down through generations. Fresh, authentic, and delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onOrderNow || scrollToMenu}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105"
              >
                Order Now
              </button>
              <button 
                onClick={scrollToMenu}
                className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                View Menu
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full transform rotate-6"></div>
            <img 
              src="/Pic/Samaybaji.jpg"
              alt="Traditional Newari Food"
              className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;