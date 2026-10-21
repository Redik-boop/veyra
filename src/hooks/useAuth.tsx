import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'https://veyra-server.onrender.com/api'; // Replace with your actual Render URL when you deploy

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
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('veyra_session');
    const token = localStorage.getItem('veyra_token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('veyra_token', data.token);
    localStorage.setItem('veyra_session', JSON.stringify(data.user));
    setCurrentUser(data.user);
  };

  const signup = async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Signup failed');
    const data = await res.json();
    localStorage.setItem('veyra_token', data.token);
    localStorage.setItem('veyra_session', JSON.stringify(data.user));
    setCurrentUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('veyra_session');
    localStorage.removeItem('veyra_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated: !!currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
