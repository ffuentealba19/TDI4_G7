import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
  UserName: string;
  UserEmail: string;
  UserPass: string;
  Vehiculos?: []; 
  url: string;
  vip: boolean;
}

// Definición del esquema del usuario
const userSchema = new Schema<IUser>({
  UserName: { type: String, required: true },
  UserEmail: { type: String, required: true, unique: true },
  UserPass: { type: String, required: true },
  Vehiculos: [],
  url: {type: String, required: false},
  vip: {type: Boolean, required: false, default: false},
}, {
  collection: 'usuarios',
  timestamps: true,
});


const User2 = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 

export default User2;