
const  connectDB = require('../database/db');

const express = require('express');
const app = express();

connectDB();

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Consulta los datos de la base de datos
app.get('/api/estacionamientos', async (req, res) => {
  res.json({ mensaje: 'Estacionamientos' });
});