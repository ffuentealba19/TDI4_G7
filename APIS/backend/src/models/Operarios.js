const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definición del esquema para el modelo de Operario
const operarioSchema = new mongoose.Schema({
  OperatorName: { type: String, required: true },
  OperatorEmail: { type: String, required: true, unique: true },
  OperatorPass: { type: String, required: true },
  url: { type: String, required: false }, // URL opcional para la imagen de perfil
  role: { type: String, default: 'Operario' }, // Rol predeterminado
}, { 
  collection: 'Operarios', // Nombre de la colección en MongoDB
  timestamps: true // Agrega `createdAt` y `updatedAt` automáticamente
});

// Hash de la contraseña antes de guardar el operario
operarioSchema.pre('save', async function (next) {
  if (this.isModified('OperatorPass')) {
    this.OperatorPass = await bcrypt.hash(this.OperatorPass, 10);
  }
  next();
});

// Modelo de Operario
const Operario = mongoose.model('Operario', operarioSchema);

module.exports = Operario;
