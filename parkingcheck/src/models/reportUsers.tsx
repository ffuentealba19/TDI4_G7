import mongoose, { Schema, model, models } from "mongoose";

const reportSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  usuarioID: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const Report = mongoose.models.ReportUser || mongoose.model<ReportUser>("ReportUser", reportSchema);

export default Report;
