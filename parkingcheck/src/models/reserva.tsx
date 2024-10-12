import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para la reserva
export interface IReserva extends Document {
  parkingSpot: mongoose.Schema.Types.ObjectId;      // Referencia al estacionamiento
  user: string;                                     // Usuario que hizo la reserva
  fechaReserva: Date;                               // Fecha y hora de la reserva
  fechaExpiracion: Date;                            // Fecha y hora de expiración
  status: string;                                   // Estado de la reserva (active, expired, cancelled)
}

// Definir el esquema de la reserva
const reservaSchema = new Schema<IReserva>({
  parkingSpot: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true }, // Relacionada con Parking
  user: { type: String, required: true },                                                // Usuario que reservó
  fechaReserva: { type: Date, required: true },                                          // Fecha y hora de la reserva
  fechaExpiracion: { type: Date, required: true },                                       // Fecha de expiración
  status: { type: String, default: 'active' }                                            // Estado inicial: activo
}, {
  collection: 'reservas', 
  timestamps: true,
});

// Crear el modelo de Reserva si no existe
const Reserva = mongoose.models.Reserva || mongoose.model<IReserva>('Reserva', reservaSchema);

export default Reserva;
