import mongoose, { Schema, Document } from 'mongoose';

export interface IOperario extends Document {
  OperatorName: string;
  OperatorEmail: string;
  OperatorPass: string;
  url?: string;
  role?: string; 
}

const operarioSchema = new Schema<IOperario>(
  {
    OperatorName: { type: String, required: true },
    OperatorEmail: { type: String, required: true, unique: true },
    OperatorPass: { type: String, required: true },
    url: { type: String, required: false },
    role: { type: String, default: 'Operario' }, 
  },
  {
    collection: 'Operarios', 
    timestamps: true, 
  }
);

const Operario = mongoose.models.Operarios || mongoose.model<IOperario>('Operarios', operarioSchema);

export default Operario;
