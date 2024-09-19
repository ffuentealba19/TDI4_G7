import mongoose, { Schema } from 'mongoose'


const userschema = new Schema(
    {
    Nombre: String,
    email : String,
    password : String,
    },
    {
        collection: 'usuarios'
    }
);

const usuarios = mongoose.models.usuarios || mongoose.model('usuarios', userschema);


export default usuarios;
