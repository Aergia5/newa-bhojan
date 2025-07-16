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
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || user?.username || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const token = localStorage.getItem('newabhojan_token');
      const res = await fetch(`http://localhost:5000/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileOpen(false), 1200);
      } else {
        const data = await res.json();
        setProfileError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('Error updating profile.');
    }
    setProfileLoading(false);
  };

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

            <button
              onClick={() => {
                setProfileOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} />
              <span>Profile</span>
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

      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {profileError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{profileError}</div>}
              {profileSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{profileSuccess}</div>}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={profileForm.password}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={profileLoading}
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;