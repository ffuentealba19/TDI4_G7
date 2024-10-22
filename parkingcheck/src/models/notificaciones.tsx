import mongoose, { Schema, Document } from 'mongoose';

export interface INotificacion extends Document {
  user: mongoose.Schema.Types.ObjectId;
  tipo: string; 
  mensaje: string;
  fechaEnvio: Date;
  nombreUsuario: string;                              // Nombre del usuario
  horaReserva: Date;                                  // Hora de la reserva
  estadoReserva: 'active' | 'expired' | 'cancelled';  // Estado de la reserva
  detallesReserva: {
    seccion: string;
    numero: string;
  };
  fechaExpiracion: Date;                              // Fecha de expiración de la reserva
}

const notificacionSchema = new Schema<INotificacion>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, required: true },
  mensaje: { type: String, required: true },
  fechaEnvio: { type: Date, required: true, default: Date.now },
  nombreUsuario: { type: String, required: true },                   // Nombre del usuario
  horaReserva: { type: Date, required: true },                       // Hora de la reserva
  estadoReserva: {                                                   // Estado de la reserva
    type: String, 
    enum: ['active', 'expired', 'cancelled'], 
    required: true 
  },
  detallesReserva: {                                                 // Detalles de la reserva
    seccion: { type: String, required: true },
    numero: { type: String, required: true },
  },
  fechaExpiracion: { type: Date, required: true },                   // Fecha de expiración de la reserva
}, {
  collection: 'Notificaciones',
  timestamps: true,
});

const Notificacion = mongoose.models.Notificacion || mongoose.model<INotificacion>('Notificacion', notificacionSchema);

export default Notificacion;
