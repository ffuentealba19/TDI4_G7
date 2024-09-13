const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://parker:ivDtqXVa7WnjZ1B7@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority&appName=ParkingCheck';

// Conectar a MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conexión a MongoDB exitosa');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      process.exit(1); // Detener la aplicación si hay error
    }
  };
  
  // Exportar la función para ser llamada en otros archivos
  module.exports = connectDB;
 