// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, logout } from '../services/AuthServices';

// Definir la interfaz del contexto de autenticación
interface AuthContextProps {
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setAuthToken: () => {},
  clearAuthToken: () => {},
});

// Crear el provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Cargar el token cuando se monta el componente
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para establecer el token y autenticar al usuario
  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Función para limpiar el token y cerrar la sesión
  const clearAuthToken = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthToken, clearAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
