// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, logout } from '../services/AuthServices';
import { initiateSocketConnection, disconnectSocket } from '../services/SocketServices';

interface AuthContextProps {
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setAuthToken: () => {},
  clearAuthToken: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      initiateSocketConnection(); // Conectar a Socket.io cuando el usuario esté autenticado
    }

    return () => {
      disconnectSocket(); // Desconectar cuando el componente se desmonte
    };
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    initiateSocketConnection(); // Conectar a Socket.io cuando se autentica
  };

  const clearAuthToken = () => {
    logout();
    setIsAuthenticated(false);
    disconnectSocket(); // Desconectar de Socket.io cuando se cierra sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthToken, clearAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
