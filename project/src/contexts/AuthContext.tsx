import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api/auth'; // Adjust if your backend runs elsewhere

const mapUserRole = (user: any) => ({
  ...user,
  name: user.name || user.username,
  role: user.isAdmin ? 'admin' : 'customer',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('newabhojan_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(mapUserRole(parsed));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const mappedUser = mapUserRole(data.user);
        setUser(mappedUser);
        localStorage.setItem('newabhojan_user', JSON.stringify(mappedUser));
        localStorage.setItem('newabhojan_token', data.token);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      // Optionally handle error
    }
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, username: userData.name })
      });
      const data = await res.json();
      if (res.ok) {
        // Optionally, auto-login after registration
        // Try to login with the new credentials
        return await login(userData.email, userData.password);
      }
    } catch (err) {
      // Optionally handle error
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('newabhojan_user');
    localStorage.removeItem('newabhojan_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};