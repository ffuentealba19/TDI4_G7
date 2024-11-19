const mongoose = require('mongoose');

const BoletaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  nombreORazonSocial: {
    type: String,
    required: true
  },
  rut: {
    type: String,
    required: true
  },
  domicilio: {
    casaMatriz: {
      type: String,
      required: true
    },
    sucursal: {
      type: String,
      required: false
    }
  },
  giro: {
    type: String,
    required: true
  },
  timbreSII: {
    type: String,
    required: true
  },
  totalConIVA: {
    type: Number,
    required: true
  },
  datosComprador: {
    nombre: {
      type: String,
      required: false
    },
    rut: {
      type: String,
      required: false
    }
  },
  fechaEmision: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Boleta', BoletaSchema);
