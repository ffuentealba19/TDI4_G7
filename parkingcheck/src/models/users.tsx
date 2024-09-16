import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    Nombre: String,
    Vehiculos: [{
        Placa: String,
        Modelo: String,
    }]
})

export default mongoose.models.Usuario || mongoose.model('Usuario', schema)