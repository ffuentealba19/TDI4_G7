import { NextApiRequest, NextApiResponse } from 'next';
import Reserva from '@/models/reserva'; // Importar el modelo de Reserva
import Parking from '@/models/parking'; // Importar el modelo de Parking

// Función para crear una reserva
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { parkingId, userId, fechaReserva } = req.body;

  // Verificar que se proporcionen los parámetros necesarios
  if (!parkingId || !userId || !fechaReserva) {
    return res.status(400).json({ success: false, message: 'Parámetros faltantes' });
  }

  try {
    // Verificar que el estacionamiento esté disponible
    const parkingSpot = await Parking.findById(parkingId);

    if (!parkingSpot || parkingSpot.status !== 'enabled') {
      return res.status(400).json({ success: false, message: 'El estacionamiento no está disponible' });
    }

    // Crear una nueva reserva con la hora especificada por el usuario
    const fechaReservaUsuario = new Date(fechaReserva); // Fecha proporcionada por el usuario

    const nuevaReserva = new Reserva({
      parkingSpot: parkingId,
      user: userId,
      fechaReserva: fechaReservaUsuario,
      status: 'active',
    });

    // Guardar la reserva en la base de datos
    await nuevaReserva.save();

    // Cambiar el estado del estacionamiento a 'reservado'
    parkingSpot.status = 'reservado';
    await parkingSpot.save();

    return res.status(201).json({
      success: true,
      message: 'Reserva creada correctamente',
      reserva: nuevaReserva,
      parkingSpot,
    });

  } catch (error) {
    console.error('Error al crear la reserva:', error);
    return res.status(500).json({ success: false, message: 'Error al crear la reserva' });
  }
};
