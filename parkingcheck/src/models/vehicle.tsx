import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  Placa: string;
  Modelo: string;
  urlCar : string;
  Color : string;
}


const vehicleSchema = new Schema<IVehicle>({
  Placa: { type: String, required: true },
  Modelo: { type: String, required: true },
  urlCar: { type: String, required: true },
  Color: { type: String, required: true },
});

const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export { vehicleSchema };
export default Vehicle;
