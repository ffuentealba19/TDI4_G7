const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    idReserva: { type: Number, required: true, unique: true }, // identificador de la reserva
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true }, // relación con usuario
    HoraInicio: { type: Date, required: true }, // Fecha y hora de inicio
    HoraFin: { type: Date, required: true }, // Fecha y hora de fin
    Estado: { type: String, enum: ['Activa', 'Finalizada', 'Cancelada'], default: 'Activa' }, // Estado de la reserva
}, { 
    collection: 'reservas',
    timestamps: true // Agrega `createdAt` y `updatedAt`
});

module.exports = mongoose.model('Reserva', reservaSchema);