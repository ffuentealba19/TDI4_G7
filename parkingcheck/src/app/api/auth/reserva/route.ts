import { NextApiRequest, NextApiResponse } from 'next';
import Reserva from '@/models/reserva';
import Parking from '@/models/parking'; 

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { parkingId, userId, fechaReserva } = req.body;


  if (!parkingId || !userId || !fechaReserva) {
    return res.status(400).json({ success: false, message: 'Parámetros faltantes' });
  }

  try {

    const parkingSpot = await Parking.findById(parkingId);

    if (!parkingSpot || parkingSpot.status !== 'enabled') {
      return res.status(400).json({ success: false, message: 'El estacionamiento no está disponible' });
    }


    const fechaReservaUsuario = new Date(fechaReserva); 

    const nuevaReserva = new Reserva({
      parkingSpot: parkingId,
      user: userId,
      fechaReserva: fechaReservaUsuario,
      status: 'active',
    });


    await nuevaReserva.save();


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
