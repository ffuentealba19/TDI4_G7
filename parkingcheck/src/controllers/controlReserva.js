import cron from 'node-cron';
import expireReservations from '@/utils/expireRes';

// Programar el cron job para que se ejecute cada minuto
cron.schedule('* * * * *', () => {
  console.log('Verificando reservas expiradas...');
  expireReservations();
});
