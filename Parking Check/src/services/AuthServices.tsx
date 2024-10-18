import axios from 'axios';

// Crear instancia de axios con configuración básica
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que esto apunte a tu backend
});

// Función para obtener los vehículos del usuario
export const getUserVehicles = async () => {
  try {
    const response = await apiClient.get('/getautos'); // Asegúrate de que esta ruta coincida con tu backend
    console.log(response.data);
    return response.data; // Retorna los vehículos del usuario
  } catch (error) {
    throw new Error('Error al obtener los vehículos');
  }
};

// Función para agregar un vehículo
export const agregarVehiculo = async (vehiculo: { Placa: string; Marca: string; Modelo: string; Color: string }) => {
  try {
    const response = await apiClient.post('/addauto', vehiculo);
    return response.data; // Retorna la respuesta del backend (lista de vehículos actualizada)
  } catch (error) {
    throw new Error('Error al agregar el vehículo');
  }
};

// Función para obtener los estacionamientos
export const getParkings = async () => {
  try {
    const response = await apiClient.get('/parkings');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los estacionamientos');
  }
};

// Función para obtener la foto de perfil del usuario
export const getProfileImage = async () => {
  const response = await apiClient.get('/profile-image'); // Cambia la ruta si es necesario
  return response.data; // Retorna la URL de la imagen
};

//funcion para subir la imagen a cloudinary
export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'parking-check'); // Cambia el nombre del preset si es necesario
  const response = await apiClient.post('/upload', formData);
  return response.data.secure_url;
};

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userData: { UserName: string; UserEmail: string; profileImage?: string }) => {
  const response = await apiClient.put('/profile', userData); // Cambia la ruta si es necesario
  return response.data; // Retorna la respuesta
};


// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  const response = await apiClient.get('/profile'); // Cambia la ruta si es necesario
  return response.data; // Retorna los datos del usuario
};

// Función para registrar usuario
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await apiClient.post('/register', { 
    UserName: username,  // Cambiado a UserName
    UserEmail: email,        // Cambiado a UserEmail
    UserPass: password   // Cambiado a UserPass
  });
  return response.data;
};

// Función para iniciar sesión
export const loginUser = async (UserEmail: string, UserPass: string) => {
  const response = await apiClient.post('/login', { UserEmail, UserPass });
  
  // Guardar token en localStorage si se recibe
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
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

// Función para cerrar sesión (remover token)
export const logout = () => {
  localStorage.removeItem('token');
};

// Añadir un interceptor para agregar el token en cada request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
