const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Parking = require('../models/Parking');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/AuthMiddleware');
const multer = require('multer'); // Para manejar archivos
const { v2: cloudinary } = require('cloudinary'); // Cloudinary
const bcrypt = require('bcrypt');

//Ruta para modificar un vehículo de un usuario autenticado
router.put('/updateauto/:id', middleware, async (req, res) => {
  const userId = req.user.userId;
  const { Placa, Marca, Modelo, Color } = req.body;
  const vehiculoId = req.params.id;
  try {
    const usuario = await User.findById
    (userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const vehiculo = usuario.Vehiculos.id(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    vehiculo.Placa = Placa;
    vehiculo.Marca = Marca;
    vehiculo.Modelo = Modelo;
    vehiculo.Color = Color;
    await usuario.save();
    res.status(200).json({ message: 'Vehículo actualizado exitosamente', vehiculos: usuario.Vehiculos });
  } catch (err) {
    console.error('Error al actualizar el vehículo:', err);
    res.status(500).json({ error: 'Error al actualizar el vehículo' });
  }
});

//Ruta para eliminar un vehículo de un usuario autenticado
router.delete('/deleteauto/:id', middleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const usuario = await User.findById
    (userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const vehiculoId = req.params.id;
    const vehiculo = usuario.Vehiculos.id(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    console.log(vehiculo);
    usuario.Vehiculos.pull(vehiculo);
    await usuario.save();
    res.status(200).json({ message: 'Vehículo eliminado exitosamente', vehiculos: usuario.Vehiculos });
  } catch (err) {
    console.error('Error al eliminar el vehículo:', err);
    res.status(500).json({ error: 'Error al eliminar el vehículo' });
  }
});


//Ruta para obtener los vehículos de un usuario autenticado
router.get('/getautos', middleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const usuario = await User.findById
    (userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario.Vehiculos);
  } catch (err) {
    console.error('Error al obtener los vehículos:', err);
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
});

// Ruta para agregar un vehículo a un usuario autenticado
router.post('/addauto', middleware, async (req, res) => {
  const { Placa, Marca, Modelo, Color } = req.body;

  // Verificar que todos los campos del vehículo estén presentes
  if (!Placa || !Marca || !Modelo || !Color) {
    return res.status(400).json({ error: 'Todos los campos del vehículo son obligatorios' });
  }

  try {
    // Obtener el usuario autenticado mediante el token
    const userId = req.user.userId;

    // Buscar al usuario por su ID
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Agregar el nuevo vehículo al array de vehículos del usuario
    usuario.Vehiculos.push({ Placa, Marca, Modelo, Color });

    // Guardar los cambios en la base de datos
    await usuario.save();

    res.status(201).json({ message: 'Vehículo agregado exitosamente', vehiculos: usuario.Vehiculos });
  } catch (err) {
    console.error('Error al agregar vehículo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Ruta para actualizar el plan de un usuario autenticado
router.put('/updateplan', middleware, async (req, res) => {
  const userId = req.user.userId; // El middleware extrae el userId desde el token
  const { Plan } = req.body; // El plan seleccionado se pasa en el body
  try {
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.Plan = Plan; // Actualiza el plan del usuario
    await usuario.save();
    res.status(200).json({ message: 'Plan actualizado exitosamente', plan: usuario.Plan });
  } catch (err) {
    console.error('Error al actualizar el plan:', err);
    res.status(500).json({ error: 'Error al actualizar el plan' });
  }
});



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
