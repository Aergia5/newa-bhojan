import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserMenuProps {
  onOrdersClick: () => void;
  onAdminClick?: () => void;
  onSettingsClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onOrdersClick, onAdminClick, onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="hidden md:block text-gray-700 font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
              user.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                onOrdersClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag size={16} />
              <span>My Orders</span>
            </button>

            {user.role === 'admin' && onAdminClick && (
              <button
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Shield size={16} />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onSettingsClick) onSettingsClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <hr className="my-2" />

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;