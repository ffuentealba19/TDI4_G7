import Reserva from '@/models/reserva';
import Parking from '@/models/parking';

const expireReservations = async () => {
  const ahora = new Date();
  
  // Buscar reservas que están activas y que han expirado
  const reservasExpiradas = await Reserva.find({
    status: 'active',
    fechaReserva: { $lt: new Date(ahora.getTime() - 30 * 60000) } // 30 minutos atrás
  });

  for (const reserva of reservasExpiradas) {
    // Actualizar el estado de la reserva a 'expired'
    reserva.status = 'expired';
    await reserva.save();

    // Cambiar el estado del estacionamiento de 'reservado' a 'enabled'
    const parkingSpot = await Parking.findById(reserva.parkingSpot);
    if (parkingSpot) {
      parkingSpot.status = 'enabled'; // Volver a habilitar el estacionamiento
      await parkingSpot.save();
    }
  }
};

export default expireReservations;
