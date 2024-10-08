const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Parking = require('../models/Parking');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/AuthMiddleware');

// Ruta para obtener todos los estacionamientos
router.get('/parkings', async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json(parkings);
  } catch (err) {
    console.error(err); // Agregar log de error
    res.status(500).send({ error: 'Error al obtener los estacionamientos' });
  }
});


// Ruta para actualizar el perfil del usuario
router.put('/profile', middleware, async (req, res) => {
  const { UserName, UserEmail } = req.body;

  // Validar que los campos no estén vacíos
  if (!UserName || !UserEmail) {
    return res.status(400).send({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Encuentra el usuario por su ID y actualiza los campos
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { UserName, UserEmail }, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }
    
    res.send({ message: 'Perfil actualizado con éxito', user: updatedUser });
  } catch (err) {
    res.status(500).send({ error: 'Error al actualizar el perfil' });
  }
});



// Ruta para obtener los datos del usuario autenticado
router.get('/profile', middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Obtiene el usuario por ID
    if (!user) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }

    // Excluir la contraseña del objeto del usuario antes de enviarlo
    const { UserPass, ...userData } = user._doc; // Suponiendo que UserPass es el campo de contraseña
    res.send(userData); // Devuelve el resto de la información del usuario
  } catch (err) {
    res.status(500).send({ error: 'Error al obtener los datos del perfil' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { email, password, UserName } = req.body;

  // Validar que todos los campos estén presentes
  if (!UserName || !email || !password) {
    return res.status(400).send({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ UserEmail: email });
    if (existingUser) {
      return res.status(400).send({ error: 'El usuario ya existe' });
    }
   
    // Crear nuevo usuario
    const user = new User({ UserName, UserEmail: email, UserPass: password});
    
    await user.save();
    console.log(hashedPassword)
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).send({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para autenticar un usuario (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validar que los campos no estén vacíos
  if (!email || !password) {
    return res.status(400).send({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const user = await User.findOne({ UserEmail : email });
    
    if (!user) {
      return res.status(401).send({ error: 'Email incorrecto' });
    }

    const isMatch = await bcrypt.compare(password, user.UserPass);
    if (!isMatch) {
      
      console.log(user.UserPass)
      return res.status(401).send({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: 'Error en el servidor' });
  }
});

module.exports = router;
