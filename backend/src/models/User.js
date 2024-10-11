const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  UserName: { type: String, required: true },
  UserEmail: { type: String, required: true, unique: true },
  UserPass: { type: String, required: true },
  Vehiculos: [{
    Placa: { type: String, required: true },
    Marca: { type: String, required: true },
    Modelo: { type: String, required: true },
    Color: { type: String, required: true },
  }],
  profileImage: { type: String, required: false }, // Cambio del nombre del campo a algo más descriptivo
}, { 
  collection: 'Usuarios',
  timestamps: true // Agrega `createdAt` y `updatedAt` automáticamente
});

// Hash de la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (this.isModified('UserPass')) {
    this.UserPass = await bcrypt.hash(this.UserPass, 10);
  }
  next();
});

// Modelo de Usuario
const User = mongoose.model('User', userSchema);
module.exports = User;
