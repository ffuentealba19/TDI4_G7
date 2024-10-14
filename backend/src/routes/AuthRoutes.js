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
    console.error(err); // Agregar log de error
    res.status(500).send({ error: 'Error al obtener los estacionamientos' });
  }
});

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret
});

// Configuración de multer (almacena archivos en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir una imagen a cloudinary
router.post('/upload', middleware, upload.single('file'), async (req, res) => {
  try {
    // Asegúrate de que haya un archivo en la solicitud
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Convertir el archivo a buffer
    const buffer = req.file.buffer;

    // Subir a Cloudinary
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });

    console.log(response);

    // Obtener el usuario autenticado
    const userId = req.user.userId;

    // Actualizar el perfil del usuario con la URL de la imagen subida
    const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: response.secure_url }, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
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
    // `req.user` contiene la información del usuario extraída del token gracias al middleware
    const userId = req.user.userId;

    // Buscar al usuario en la base de datos por su ID
    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver la URL de la imagen de perfil (campo 'url')
    res.json({ ImgUrl: usuario.url });

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
    const { UserName, UserEmail, UserPass } = req.body;
    

  // Validar que todos los campos estén presentes
  if (!UserName || !UserEmail || !UserPass) {
    return res.status(400).send({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ UserEmail });
    if (existingUser) {
      return res.status(400).send({ error: 'El usuario ya existe' });
    }
   
    // Crear nuevo usuario
    const user = new User({ UserName, UserEmail, UserPass});
    
    await user.save();
    
    res.status(201).send({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).send({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para autenticar un usuario (login)
router.post('/login', async (req, res) => {
  try {
    // Verifica qué datos están llegando en el body
    console.log('Datos recibidos en /login:', req.body);

    const { UserEmail, UserPass } = req.body;

    // Validar que los campos no estén vacíos
    if (!UserEmail || !UserPass) {
      console.log('Faltan campos en la solicitud'); // Log para indicar que faltan campos
      return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }

    // Buscar al usuario por su email
    const user = await User.findOne({ UserEmail });
    if (!user) {
      console.log('Email incorrecto:', UserEmail); // Log para indicar que no se encontró el usuario
      return res.status(401).send({ error: 'Email incorrecto' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(UserPass, user.UserPass);
    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', UserEmail); // Log para indicar que la contraseña es incorrecta
      return res.status(401).send({ error: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    console.log('Token generado:', token); // Log del token generado
    
    // Enviar el token como respuesta
    res.send({ token });
  } catch (err) {
    console.error('Error en el servidor durante /login:', err.message); // Log del error del servidor
    res.status(500).send({ error: 'Error en el servidor' });
  }
});

module.exports = router;
