import React from 'react';
import { ShoppingCart, User, Package, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
  onLoginClick: () => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartItems,
  onCartClick,
  onLoginClick,
  onOrdersClick,
  onAdminClick,
  onSettingsClick
}) => {
  const { user } = useAuth();
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
            <img src="/Pic/NB-Logo.png" alt="NewaBhojan Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold text-red-600">NewaBhojan</h1>
            <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
              Authentic Newari Cuisine
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToTop()}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Orders button for customers */}
                {user.role === 'customer' && (
                  <button
                    onClick={onOrdersClick}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">Orders</span>
                  </button>
                )}

                {/* Admin button for admin users */}
                {user.role === 'admin' && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                {/* User menu */}
                <UserMenu onOrdersClick={onOrdersClick} onAdminClick={onAdminClick} onSettingsClick={onSettingsClick} />
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;