import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      const foundUser = mockUsers.find(u => u.id === parseInt(savedUserId));
      if (foundUser) setUser(foundUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Role Determination from Email Pattern
    let role: Role | null = null;
    if (email.toLowerCase().includes('.gtm@')) {
      role = 'GTM Manager';
    } else if (email.toLowerCase().includes('.cu@')) {
      role = 'CU Manager';
    }

    if (!role) {
      return { success: false, message: 'Invalid role for this email pattern. Use .gtm@ or .cu@' };
    }

    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    // Simulating backend validation
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      if (foundUser.role !== role) {
        return { success: false, message: 'Invalid role for this email' };
      }
      setUser(foundUser);
      localStorage.setItem('userId', foundUser.id.toString());
      return { success: true, message: `Welcome back, ${foundUser.name}` };
    }

    return { success: false, message: 'User not found or invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
