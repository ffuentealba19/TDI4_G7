const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    // Encriptar la contraseña
   
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
