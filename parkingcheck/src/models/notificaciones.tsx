import mongoose, { Schema, Document } from 'mongoose';

export interface INotificacion extends Document {
  user: mongoose.Schema.Types.ObjectId;
  tipo: string; // Por ejemplo, 'alerta' o 'expiracion'
  mensaje: string;
  fechaEnvio: Date;
}

const notificacionSchema = new Schema<INotificacion>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, required: true },
  mensaje: { type: String, required: true },
  fechaEnvio: { type: Date, required: true, default: Date.now },
}, {
  collection: 'notificaciones',
  timestamps: true,
});

const Notificacion = mongoose.models.Notificacion || mongoose.model<INotificacion>('Notificacion', notificacionSchema);

export default Notificacion;
