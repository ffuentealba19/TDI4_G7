import mongoose, { Schema } from 'mongoose'


const userschema = new Schema(
    {
    Nombre: String,
    Vehiculos: [{
        Placa: String,
        Modelo: String,
    }]
    },
    {
        collection: 'usuarios'
    }
);

const usuarios = mongoose.models.usuarios || mongoose.model('usuarios', userschema);


export default usuarios;
