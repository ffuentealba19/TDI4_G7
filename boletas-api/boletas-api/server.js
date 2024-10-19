const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conectar a la base de datos (MongoDB como ejemplo)
mongoose.connect('mongodb://localhost:27017/boletas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.log('Error al conectar a la base de datos:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Boletas funcionando');
});

// Configurar puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

const boletasRoutes = require('./routes/boletas');

// Usar las rutas de boletas
app.use('/api/boletas', boletasRoutes);
