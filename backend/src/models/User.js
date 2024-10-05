const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  UserName: { type: String, required: true },
  UserEmail: { type: String, required: true, unique: true },
  UserPass: { type: String, required: true },
  Vehiculos: { type: Array, default: [] },
}, {
  collection: 'usuarios', // Especifica el nombre de la colección aquí
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('UserPass')) {
    this.UserPass = await bcrypt.hash(this.UserPass, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
