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
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  }
}, { collection: 'Estacionamientos' });

const Parking = mongoose.model('Parking', parkingSchema);
module.exports = Parking;
