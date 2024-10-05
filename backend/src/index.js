const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Asegúrate de tener esto
const authRoutes = require('./routes/AuthRoutes');
const protectedRoutes = require('./routes/ProtectedRoutes');
const app = express();

// Conexión a MongoDB
const uri = 'mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/ParkingCheckIntegra?retryWrites=true&w=majority&appName=ParkingCheck';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(cors()); // Asegúrate de que CORS está configurado
app.use(express.json());
app.use(authRoutes);        // Rutas de autenticación (registro y login)
app.use(protectedRoutes);   // Rutas protegidas que requieren autenticación

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
