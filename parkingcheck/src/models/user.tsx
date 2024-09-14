import mongoose from "mongoose"

const schema = new mongoose.Schema({
    rut: String,
    name: String,
    correo: String,

})
export default mongoose.model("User", schema)
