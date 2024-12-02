import axios from 'axios';
import { push, reload } from 'ionicons/icons';
import { Redirect, Router } from 'react-router';

// Crear instancia de axios con configuración básica
const apiClient = axios.create({
  baseURL: 'http://localhost:4001', // Cambiar si usas un entorno en producción https://parkingcheck.onrender.com'
});


//Operarios

// Función para registrar un nuevo operario
export const registerOperator = async (operatorData: { OperatorName: string; OperatorEmail: string; OperatorPass: string }) => {
  try {
    const response = await apiClient.post('/register-operator', operatorData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el operario:', error);
    throw new Error('Error al registrar el operario');
  }
};

// Función para iniciar sesión como operario
export const loginOperator = async (OperatorEmail: string, OperatorPass: string) => {
  try {
    //limpiar token existente
    localStorage.removeItem('token');
    const response = await apiClient.post('/auth/login-operator', { OperatorEmail, OperatorPass });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Guardar token para operarios;
    }
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión como operario:', error);
    throw new Error('Error al iniciar sesión como operario');
  }
};
//funcion logout operario
export const logoutOperator = () => {
  localStorage.removeItem('token');
};

// Función para obtener las reservas del usuario
export const getReservations = async () => {
  try {
    const response = await apiClient.get('/parking/reservas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    throw error;
  }
};

// Función para crear una nueva reserva
export const createReservation = async (reservationData: { seccion: string, numero: string, fechaReserva: Date, fechaExpiracion: Date, userid: string }) => {
  try {
    const response = await apiClient.post('/parking/reservas', reservationData);
    return response.data;
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw error;
  }
};

// Función para actualizar una reserva existente
export const updateReservation = async (reservationId: string, updateData: { fechaExpiracion?: Date, status?: string }) => {
  try {
    const response = await apiClient.put(`/parking/reservas/${reservationId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    throw error;
  }
};

// Función para eliminar una reserva
export const deleteReservation = async (reservationId: string) => {
  try {
    const response = await apiClient.delete(`/parking/reservas/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    throw error;
  }
};


// Función para obtener los espacios disponibles desde la API
export const getAvailableSpots = async () => {
  try {
    const response = await apiClient.get('/parking/available-spots'); // Ruta del backend para los espacios disponibles
    return response.data.availableSpots; // Retorna solo el número de espacios disponibles
  } catch (error) {
    console.error('Error al obtener los espacios disponibles:', error);
    throw new Error('Error al obtener los espacios disponibles');
  }
};

// Función para obtener los estacionamientos
export const getParkings = async () => {
  try {
    const response = await apiClient.get('/parking/parkings'); // Cambiar si la ruta es diferente
    return response.data;
  } catch (error) {
    console.error('Error al obtener los estacionamientos:', error);
    throw error;
  }
};

// Función para actualizar un estacionamiento
export const updateParking = async (parkingId: string) => {
  try {
    const response = await apiClient.put(`/parking/update-parking/${parkingId}`);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estacionamiento:', error);
    throw error;
  }
};


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
    const response = await apiClient.put('/auth/updateplan', { Plan: plan }); // Ya no envías el email en la URL
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    throw new Error('Error al actualizar el plan');
  }
};

// Función para actualizar un vehículo sin imagen
export const updateVehicle = async (id: string, vehicle: { Placa: string; Marca: string; Modelo: string; Color: string }, newImage: File | null) => {
  try {
    // Primero, actualizar los datos del vehículo sin la imagen
    const response = await apiClient.put(`/auth/updateauto/${id}`, vehicle);

    // Si se ha seleccionado una nueva imagen, subirla
    if (newImage) {
      const uploadResponse = await uploadImage(newImage, 'vehicle', id); // Usar el ID del vehículo para subir la imagen
      console.log('Imagen del vehículo actualizada:', uploadResponse);
    }

    return response.data;
  } catch (error) {
    console.error('Error al actualizar el vehículo:', error);
    throw new Error('Error al actualizar el vehículo');
  }
};


// Función para borrar un vehículo
export const deleteVehicle = async (id: string) => {
  try {
    const response = await apiClient.delete(`/auth/deleteauto/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al borrar el vehículo:', error);
    throw new Error('Error al borrar el vehículo');
  }
};

// Función para obtener los vehículos del usuario
export const getUserVehicles = async () => {
  try {
    const response = await apiClient.get('/auth/getautos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    throw new Error('Error al obtener los vehículos');
  }
};

// Función para obtener la foto de perfil del usuario
export const getProfileImage = async () => {
  try {
    const response = await apiClient.get('/auth/profile-image');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la imagen de perfil:', error);
    throw new Error('Error al obtener la imagen de perfil');
  }
};


// Función para subir la imagen a Cloudinary
export const uploadImage = async (image: File, type: 'profile' | 'vehicle', vehiculoId?: string) => {
  const formData = new FormData();
  formData.append('file', image);

  // Construir la URL dependiendo del tipo de imagen
  let url = `/auth/upload/${type}`;
  if (type === 'vehicle' && vehiculoId) {
    url += `/${vehiculoId}`;
  }

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('Error al subir la imagen');
  }
};


// Función para agregar un vehículo sin la imagen
export const agregarVehiculo = async (vehiculo: { Placa: string; Marca: string; Modelo: string; Color: string }) => {
  try {
    const response = await apiClient.post('/auth/addauto', vehiculo);
    return response.data; // Devolver los datos del vehículo creado, incluyendo el _id
  } catch (error) {
    console.error('Error al agregar el vehículo:', error);
    throw new Error('Error al agregar el vehículo');
  }
};


// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userData: { UserName: string; UserEmail: string; profileImage?: string }) => {
  try {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw new Error('Error al actualizar el perfil del usuario');
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw new Error('Error al obtener el perfil del usuario');
  }
};

// Función para registrar un usuario
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/register', { 
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
    const response = await apiClient.post('/auth/login', { UserEmail, UserPass });
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
  console.log ('Token de getToken',localStorage.getItem('token'));
  return localStorage.getItem('token');
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token'); // Eliminar token del localStorage
  window.location.href = '/login'; // Redirigir a la página de inicio de sesión

};

export const solicitarEspacio = async (userId: string, userName: string) => {
  try {
    const response = await apiClient.post(`/parking/assign-parking/${userId}/${userName}`);
    
    // Aquí procesas la respuesta, puedes guardar el parking info si lo necesitas
    console.log('Espacio asignado:', response.data);
    return response.data;  // Devuelve la respuesta para que pueda ser utilizada en otro lado si es necesario

  } catch (error) {
    console.error('Error al solicitar el espacio de estacionamiento:', error);
    throw new Error('Error al solicitar el espacio de estacionamiento');
  }
};

// Función para liberar un espacio de estacionamiento
export const liberarEspacio = async (userId: string) => {
  try {
    const response = await apiClient.post(`/parking/free-parking/${userId}`);
    
    // Aquí procesas la respuesta, puedes mostrar un mensaje o realizar acciones adicionales
    console.log('Espacio liberado:', response.data);
    return response.data;  // Devuelve la respuesta para que pueda ser utilizada en otro lado si es necesario

  } catch (error) {
    console.error('Error al liberar el espacio de estacionamiento:', error);
    throw new Error('Error al liberar el espacio de estacionamiento');
  }
};

export const verificarEspacio = async (userId: string) => {
  try {
    const response = await apiClient.get(`/parking/check-parking/${userId}`);
    return response.data; // Devuelve { hasParking: boolean, parkingDetails?: object }
  } catch (error) {
    console.error('Error al verificar espacio de estacionamiento:', error);
    throw error;
  }
};
