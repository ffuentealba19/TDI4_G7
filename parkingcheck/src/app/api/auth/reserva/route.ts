import apiClient from "@/libs/axios";  // Asegúrate de que apiClient esté configurado correctamente

// Función para crear una reserva
const createReserva = async (seccion:string, numero:string, correo:string, fechaReserva:string, fechaExpiracion:string, userId:string) => {
  try {
    // Preparar los datos a enviar a la API
    const reservaData = { seccion, numero, correo, fechaReserva, fechaExpiracion, userId };

    // Hacer la solicitud POST para crear la reserva
    const response = await apiClient.post('/reservas', reservaData);

    // Retornar la respuesta de la API, que contiene los detalles de la reserva creada
    return response.data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw new Error('Error al crear la reserva');
  }
};

export { createReserva };
