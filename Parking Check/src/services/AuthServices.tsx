import axios from 'axios';

// Crear instancia de axios con configuración básica
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Cambiar si usas un entorno en producción https://parkingcheck.onrender.com'
});

// Añadir un interceptor para agregar el token en cada request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Función para actualizar el plan del usuario
export const updatePlan = async (plan: string) => {
  try {
    const response = await apiClient.put('/updateplan', { Plan: plan }); // Ya no envías el email en la URL
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    throw new Error('Error al actualizar el plan');
  }
};

// Función para actualizar un vehículo
export const updateVehicle = async (id: string, vehicle: { Placa: string; Marca: string; Modelo: string; Color: string }) => {
  try {
    const response = await apiClient.put(`/updateauto/${id}`, vehicle);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el vehículo:', error);
    throw new Error('Error al actualizar el vehículo');
  }
};

// Función para borrar un vehículo
export const deleteVehicle = async (id: string) => {
  try {
    const response = await apiClient.delete(`/deleteauto/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al borrar el vehículo:', error);
    throw new Error('Error al borrar el vehículo');
  }
};

// Función para obtener los vehículos del usuario
export const getUserVehicles = async () => {
  try {
    const response = await apiClient.get('/getautos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    throw new Error('Error al obtener los vehículos');
  }
};

// Función para agregar un vehículo
export const agregarVehiculo = async (vehiculo: { Placa: string; Marca: string; Modelo: string; Color: string }) => {
  try {
    const response = await apiClient.post('/addauto', vehiculo);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el vehículo:', error);
    throw new Error('Error al agregar el vehículo');
  }
};

// Función para obtener los estacionamientos
export const getParkings = async () => {
  try {
    const response = await apiClient.get('/parkings');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    throw new Error('Error al obtener los estacionamientos');
  }
};

// Función para obtener la foto de perfil del usuario
export const getProfileImage = async () => {
  try {
    const response = await apiClient.get('/profile-image');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la imagen de perfil:', error);
    throw new Error('Error al obtener la imagen de perfil');
  }
};

// Función para subir la imagen a Cloudinary
export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'parking-check');
  try {
    const response = await apiClient.post('/upload', formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('Error al subir la imagen');
  }
};

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userData: { UserName: string; UserEmail: string; profileImage?: string }) => {
  try {
    const response = await apiClient.put('/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw new Error('Error al actualizar el perfil del usuario');
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw new Error('Error al obtener el perfil del usuario');
  }
};

// Función para registrar un usuario
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/register', { 
      UserName: username, 
      UserEmail: email, 
      UserPass: password 
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw new Error('Error al registrar el usuario');
  }
};

// Función para iniciar sesión
export const loginUser = async (UserEmail: string, UserPass: string) => {
  try {
    const response = await apiClient.post('/login', { UserEmail, UserPass });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Guardar token
    }
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw new Error('Error al iniciar sesión');
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

// Obtener el token del localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
};
