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
    Imagen: { type: String, required: false }, // Nueva propiedad para la URL de la imagen del vehículo
  }],
  profileImage: { type: String, required: false }, // Imagen de perfil del usuario
  Plan: { type: String, default: 'Basico' }, // Plan básico por defecto
}, { 
  collection: 'usuarios',
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
