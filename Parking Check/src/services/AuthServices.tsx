// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que esto apunte a tu backend
});

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await apiClient.post('/register', { 
    UserName: username,  // Cambiado a UserName
    email: email,    // Cambiado a UserEmail
    password: password    // Cambiado a UserPass
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/login', { email, password });

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};

