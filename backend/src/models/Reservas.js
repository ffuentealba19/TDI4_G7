const mongoose = require('mongoose');

const parkingReservationSchema = new mongoose.Schema({
  seccion: {
    type: String,
    required: true
  },
  numero: {
    type: String, // O cambiar a Number si es apropiado
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId, // Cambiado a ObjectId
    ref: 'User',
    required: true
  },
  fechaReserva: {
    type: Date,
    required: true
  },
  fechaExpiracion: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Validar que fechaExpiracion no sea más de un día mayor que fechaReserva
        return (value.getTime() - this.fechaReserva.getTime()) <= 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      },
      message: 'La reserva no puede ser mayor a un día.'
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'], // Valores actualizados
    default: 'active',
    required: true
  }
}, {
  collection: 'reservas',
  timestamps: true // Mantener para que Mongoose agregue `createdAt` y `updatedAt` automáticamente
});

const ParkingReservation = mongoose.model('ParkingReservation', parkingReservationSchema);

module.exports = ParkingReservation;
