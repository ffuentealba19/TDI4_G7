require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Para manejar Socket.io
const { Server } = require('socket.io'); // Para Socket.io
const nodemailer = require('nodemailer'); // Importar nodemailer

// Importar rutas
const authRoutes = require('./routes/AuthRoutes'); // Importar rutas de autenticación
const protectedRoutes = require('./routes/ProtectedRoutes'); // Importar rutas protegidas
const parkingRoutes = require('./routes/ParkingRoutes'); // Importar rutas de estacionamientos

const app = express();

// Crear servidor HTTP para usar con Socket.io
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8100", // Cambia esto a la URL de tu frontend si es necesario
    methods: ["GET", "POST"]
  }
});

// Conexión a MongoDB usando la variable de entorno
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Pasar la referencia de `io` y `transporter` a las rutas
app.use('/parking', parkingRoutes(io, transporter));
app.use('/auth', authRoutes(io)); // Si `authRoutes` no necesita `transporter`, no es necesario pasarlo
app.use('/protected', protectedRoutes(io)); // Lo mismo aquí

// Socket.io: Manejo de conexiones
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Iniciar el servidor
const port = process.env.PORT || 4001;
server.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
