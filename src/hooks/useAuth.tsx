import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedDatabase } from './data/seed';

interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  createdAt: number;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      const savedUser = localStorage.getItem('veyra_session');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    };
    init();
  }, []);

  const logout = () => {
    localStorage.removeItem('veyra_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated: !!currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
