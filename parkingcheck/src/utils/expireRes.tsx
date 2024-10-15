import Reserva from '@/models/reserva';
import Parking from '@/models/parking';

const expireReservations = async () => {
  const ahora = new Date();
  
  const reservasExpiradas = await Reserva.find({
    status: 'active',
    fechaReserva: { $lt: new Date(ahora.getTime() - 30 * 60000) } 
  });

  for (const reserva of reservasExpiradas) {

    reserva.status = 'expired';
    await reserva.save();


    const parkingSpot = await Parking.findById(reserva.parkingSpot);
    if (parkingSpot) {
      parkingSpot.status = 'enabled'; 
      await parkingSpot.save();
    }
  }
};

export default expireReservations;
