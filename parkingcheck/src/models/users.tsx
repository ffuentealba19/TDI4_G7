import mongoose, { Schema, Document } from 'mongoose';

// Definición de la interfaz para el usuario
export interface IUser extends Document {
  UserName: string;
  UserEmail: string;
  UserPass: string;
  Vehiculos?: {
    Placa: string;
    Modelo: string;
  }[];
}

// Definición del esquema del usuario
const userSchema = new Schema<IUser>({
  UserName: { type: String, required: true },
  UserEmail: { type: String, required: true, unique: true },
  UserPass: { type: String, required: true },
  Vehiculos: [{
    Placa: String,
    Modelo: String,
  }]
}, {
  collection: 'usuarios',
  timestamps: true,
});


const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 

export default User;
