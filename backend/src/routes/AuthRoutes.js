const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Parking = require('../models/Parking');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/AuthMiddleware');
const multer = require('multer'); // Para manejar archivos
const { v2: cloudinary } = require('cloudinary'); // Cloudinary
const bcrypt = require('bcrypt');

// Ruta para obtener todos los estacionamientos
router.get('/parkings', async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json(parkings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los estacionamientos' });
  }
});

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});

// Configuración de multer (almacena archivos en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir una imagen a Cloudinary
router.post('/upload', middleware, upload.single('file'), async (req, res) => {
  try {
    // Asegúrate de que haya un archivo en la solicitud
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Convertir el archivo a buffer y subir a Cloudinary
    const buffer = req.file.buffer;
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });

    // Obtener el usuario autenticado
    const userId = req.user.userId;

    // Actualizar el perfil del usuario con la URL de la imagen subida
    const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: response.secure_url }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Imagen subida y perfil actualizado',
      user: updatedUser,
    });

  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

// Ruta para obtener la URL de la imagen del perfil del usuario autenticado
router.get('/profile-image', middleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver la URL de la imagen de perfil
    res.json({ ImgUrl: usuario.profileImage }); // Asegúrate de que 'profileImage' sea el campo correcto

  } catch (error) {
    console.error('Error al obtener la imagen del perfil:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Ruta para actualizar el perfil del usuario
router.put('/profile', middleware, async (req, res) => {
  const { UserName, UserEmail } = req.body;

  // Validar que los campos no estén vacíos
  if (!UserName || !UserEmail) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { UserName, UserEmail }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil actualizado con éxito', user: updatedUser });
  } catch (err) {
    console.error('Error al actualizar el perfil:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

// Ruta para obtener los datos del usuario autenticado
router.get('/profile', middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Excluir la contraseña del objeto del usuario antes de enviarlo
    const { UserPass, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (err) {
    console.error('Error al obtener los datos del perfil:', err);
    res.status(500).json({ error: 'Error al obtener los datos del perfil' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { UserName, UserEmail, UserPass } = req.body;

  if (!UserName || !UserEmail || !UserPass) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ UserEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const user = new User({ UserName, UserEmail, UserPass: UserPass });
    
    await user.save();
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para autenticar un usuario (login)
router.post('/login', async (req, res) => {
  try {
    const { UserEmail, UserPass } = req.body;

    if (!UserEmail || !UserPass) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const user = await User.findOne({ UserEmail });
    if (!user) {
      return res.status(401).json({ error: 'Email incorrecto' });
    }

    const isMatch = await bcrypt.compare(UserPass, user.UserPass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error en el servidor durante /login:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
