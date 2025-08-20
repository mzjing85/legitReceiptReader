import React, { createContext, useState, ReactNode, useContext } from 'react';

console.log('🚀 AuthContext file loaded');

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('🏗️ AuthProvider component rendering');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Set to false immediately

  console.log('📊 Current state - isLoggedIn:', isLoggedIn, 'loading:', loading);

  const login = async (newToken: string) => {
    console.log('🔐 Login function called');
    setToken(newToken);
    setIsLoggedIn(true);
    console.log('✅ Login state updated successfully');
  };

  const logout = async () => {
    console.log('🚪 Logout function called');
    setToken(null);
    setIsLoggedIn(false);
    console.log('✅ Logout state updated successfully');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);