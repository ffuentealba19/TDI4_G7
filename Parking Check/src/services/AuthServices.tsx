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
  return response.data;
};
