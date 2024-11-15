import apiClient from "@/libs/axios";

// Función para crear una reserva
const createReserva = async (seccion:string, numero:string, correo:string, fechaReserva:string, fechaExpiracion:string, userId:string) => {
  try {

    const reservaData = { seccion, numero, correo, fechaReserva, fechaExpiracion, userId };


    const response = await apiClient.post('/reservas', reservaData);

    return response.data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw new Error('Error al crear la reserva');
  }
};

export { createReserva };
