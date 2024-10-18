import mongoose, { Schema, Document } from 'mongoose';

// Interfaz de Parking
export interface IParking extends Document {
  number: String;
  section: String;
  status: string;             // 'enabled', 'reservado', etc.
  occupiedBy?: string | null; // ID del usuario si está ocupado
}

// Esquema de Parking
const parkingSchema = new Schema<IParking>({
  number: { type: String, required: true },
  section: { type: String, required: true },
  status: { type: String, required: true, default: 'enabled' }, // Por defecto estará 'enabled'
  occupiedBy: { type: String, default: null }
}, {
  collection: 'Estacionamientos',
  timestamps: true,
});

const Parking = mongoose.models.Parking || mongoose.model<IParking>('Parking', parkingSchema);

export default Parking;
