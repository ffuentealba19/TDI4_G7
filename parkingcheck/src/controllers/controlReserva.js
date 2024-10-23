import cron from 'node-cron';
import expireReservations from '@/utils/expireRes';


cron.schedule('* * * * *', () => {
  console.log('Verificando reservas expiradas...');
  expireReservations();
});
