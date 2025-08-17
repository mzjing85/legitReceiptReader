import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  token: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Load token from SecureStore on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log('Error loading token from SecureStore:', err);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('userToken', newToken);
      setToken(newToken);
      setIsLoggedIn(true);
    } catch (err) {
      console.log('Error saving token to SecureStore:', err);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setToken(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.log('Error deleting token from SecureStore:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
