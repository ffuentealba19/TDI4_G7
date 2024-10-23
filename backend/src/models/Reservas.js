const mongoose = require('mongoose');

const parkingReservationSchema = new mongoose.Schema({
  seccion: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  id_usuario: {
    type: String, // Cambiado a String en lugar de ObjectId
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
    enum: ['active', 'inactive', 'expired'], // Enum para los posibles valores de estado
    default: 'inactive',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Este campo no puede ser modificado
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'reservas',
  timestamps: true // Esto añade automáticamente los campos `createdAt` y `updatedAt`
});

const ParkingReservation = mongoose.model('ParkingReservation', parkingReservationSchema);

module.exports = ParkingReservation;
