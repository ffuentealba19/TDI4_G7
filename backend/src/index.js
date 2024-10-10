require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Importa express-rate-limit
const authRoutes = require('./routes/AuthRoutes');
const protectedRoutes = require('./routes/ProtectedRoutes');
const app = express();

// Conexión a MongoDB usando la variable de entorno
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Configurar rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por 'windowMs'
  message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos.',
});

// Aplicar el rate limiter globalmente
app.use(limiter);

// Middleware
app.use(cors()); // Asegúrate de que CORS está configurado
app.use(express.json());
app.use(authRoutes);        // Rutas de autenticación (registro y login)
app.use(protectedRoutes);   // Rutas protegidas que requieren autenticación

// Iniciar el servidor usando la variable de entorno para el puerto
const port = process.env.PORT || 3000; // Usa la variable PORT o 3000 por defecto
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
