
const  connectDB = require('../database/db');

const express = require('express');
const app = express();

connectDB();

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
  
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
