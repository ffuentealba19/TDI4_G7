const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  section: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['enabled', 'disabled'], 
    required: true 
  },
  occupiedBy: { 
    type: String, 
    default: null // Puede ser el ID de usuario o un string 
  }
}, { collection: 'Estacionamientos' }); // Especifica el nombre de la colección

const Parking = mongoose.model('Parking', parkingSchema);
module.exports = Parking;
