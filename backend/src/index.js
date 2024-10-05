const express = require("express")
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3000;



app.use(express.json());
app.use(cors());

app.get("/api/data", (req, res) =>{

    res.json({ message: 'hola papu!' });
});
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`); // Asegúrate de que está bien escrito
});



//mongo conexion
/*const uri = 'mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
*/
