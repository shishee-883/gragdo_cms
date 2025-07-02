'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  // Initialize token from localStorage on mount (client-side only)
  useEffect(() => {
    const storedToken = localStorage.getItem('token_cms');
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem('token_cms', newToken);
    setTokenState(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem('token_cms');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}