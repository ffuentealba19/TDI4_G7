const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a MongoDB usando la variable de entorno
const uri = process.env.MONGODB_URI;

// Conectar a la base de datos (MongoDB como ejemplo)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.log('Error al conectar a la base de datos:', err));


// Configurar puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


