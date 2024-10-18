import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para la reserva
export interface IReserva extends Document {
  seccion: string;                                  // Sección del estacionamiento
  numero: string;                                   // Número de estacionamiento
  id_usuario: string;                               // ID del usuario que reservó
  fechaReserva: Date;                               // Fecha en la que debería llegar
  fechaExpiracion: Date;                            // Fecha y hora de vencimiento
  status: 'active' | 'expired' | 'cancelled';       // Estado de la reserva
}

// Definir el esquema de la reserva
const reservaSchema = new Schema<IReserva>({
  seccion: { type: String, required: true },                                        // Sección del estacionamiento
  numero: { type: String, required: true },                                         // Número de estacionamiento
  id_usuario: { type: String, required: true },                                     // ID del usuario que reservó
  fechaReserva: { type: Date, required: true },                                     // Fecha y hora en la que debe llegar
  fechaExpiracion: { type: Date, required: true },                                  // Fecha de expiración (media hora después de no llegar)
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled'], 
    default: 'active' 
  },                                                                                // Estado inicial
}, {
  collection: 'reservas', 
  timestamps: true,
});

// Crear el modelo de Reserva si no existe
const Reserva = mongoose.models.Reserva || mongoose.model<IReserva>('Reserva', reservaSchema);

export default Reserva;
