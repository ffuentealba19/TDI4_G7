const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Parking = require('../models/Parking');
const Operario = require('../models/Operarios');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/AuthMiddleware');
const multer = require('multer'); // Para manejar archivos
const { v2: cloudinary } = require('cloudinary'); // Cloudinary
const bcrypt = require('bcrypt');
  
module.exports = (io) => {


  // Ruta para registrar un nuevo operario
  router.post('/register-operator', async (req, res) => {
    const { OperatorName, OperatorEmail, OperatorPass } = req.body;
    if (!OperatorName || !OperatorEmail || !OperatorPass) {
      return res.status(400).json({ message: 'Faltan campos' });
    }
    try {
      const existingOperator = await Operario.findOne({ OperatorEmail });
      if (existingOperator) {
        return res.status(400).json({ message: 'Operario ya registrado' });
      }
      const operario = new Operario({ OperatorName, OperatorEmail, OperatorPass });
      await operario.save();
      res.status(201).json({ message: 'Operario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar operador:', error);
      res.status(500).json({ message: 'Error al registrar operador' });
    }
  });

  // Ruta para logear un nuevo operador
  router.post('/login-operator', async (req, res) => {
    const { OperatorEmail, OperatorPass } = req.body;
  
    // Validar que se hayan ingresado todos los campos requeridos
    if (!OperatorEmail || !OperatorPass) {
      return res.status(400).json({ message: 'Faltan campos' });
    }
  
    try {
      // Buscar al operador por correo electrónico
      const operario = await Operario.findOne({ OperatorEmail });
      if (!operario) {
        return res.status(400).json({ message: 'Correo no registrado' });
      }
  
      // Verificar la contraseña usando bcrypt
      const isCorrect = await bcrypt.compare(OperatorPass, operario.OperatorPass);
      if (!isCorrect) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Crear el token JWT con un tiempo de expiración de 8 horas
      const token = jwt.sign(
        { operarioId: operario._id, email: operario.OperatorEmail, role: operario.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '8h' }
      );
      console.log(token)
  
      // Enviar el token y un mensaje de éxito
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        redirectUrl: '/HomeOperators',
      });
    } catch (error) {
      console.error("Error en el login de operador:", error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  });



  // Ruta para eliminar la cuenta del usuario autenticado
  router.delete('/delete-account', middleware, async (req, res) => {
    const userId = req.user.userId; // Obtenemos el ID del usuario autenticado a través del middleware
    const { UserPass } = req.body; // La contraseña actual se envía en el body para validación

    try {
      // Buscar al usuario por ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar la contraseña actual del usuario
      const isMatch = await bcrypt.compare(UserPass, user.UserPass);
      if (!isMatch) {
        return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      }

      // Eliminar la cuenta del usuario
      await User.deleteOne({ _id: userId });

      res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Ruta para cambiar la contraseña del usuario autenticado
  router.put('/change-password', middleware, async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { NewPass } = req.body; // Obtener la nueva contraseña del body

    // Verificar que se haya proporcionado una nueva contraseña
    if (!NewPass) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida' });
    }

    try {
      // Buscar al usuario por ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Hashear la nueva contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(NewPass, 10);
      user.UserPass = hashedPassword; // Actualizar la contraseña en el usuario
      await user.save();

      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


  // Ruta para cambiar el email del usuario autenticado
  router.put('/change-email', middleware, async (req, res) => {
    const userId = req.user.userId; // El middleware extrae el userId desde el token
    const { NewEmail, UserPass } = req.body; // Obtener el nuevo email y contraseña del body

    try {
      // Buscar al usuario por ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar la contraseña actual utilizando bcrypt
      const isPasswordValid = await bcrypt.compare(UserPass, user.UserPass);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Actualizar el email del usuario
      user.UserEmail = NewEmail;
      await user.save();

      res.status(200).json({ message: 'Email actualizado con éxito' });
    } catch (error) {
      console.error('Error en la actualización del email:', error);
      res.status(500).json({ error: 'Error al actualizar el email' });
    }
  });


   // Ruta para obtener el número de espacios disponibles en tiempo real
    router.get('/available-spots', async (req, res) => {
    try {
      const parkings = await Parking.find(); // Obtener todos los estacionamientos
      const availableSpots = parkings.filter(p => !p.occupiedBy).length; // Filtrar los no ocupados
      res.status(200).json({ availableSpots });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los espacios disponibles' });
    }
  });

  // Función para emitir actualizaciones de espacios disponibles
  const emitirActualizacionEstacionamientos = async () => {
    try {
      const parkings = await Parking.find();
      const availableSpots = parkings.filter(p => !p.occupiedBy).length;
      io.emit('updateAvailableSpots', availableSpots); // Emitir el número de espacios disponibles
    } catch (err) {
      console.error('Error al emitir actualizaciones de espacios disponibles:', err);
    }
  };

  // Ejemplo de ruta donde se actualiza el estado de un estacionamiento
  router.put('/update-parking/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const parking = await Parking.findById(id);
      if (!parking) {
        return res.status(404).json({ message: 'Estacionamiento no encontrado' });
      }

      parking.occupiedBy = parking.occupiedBy ? null : 'userId'; // Alternar el estado de ocupación
      await parking.save();

      // Emitir la actualización a los clientes conectados
      emitirActualizacionEstacionamientos();

      res.status(200).json({ message: 'Estado del estacionamiento actualizado', parking });
    } catch (err) {
      console.error('Error al actualizar el estado del estacionamiento:', err);
      res.status(500).json({ error: 'Error al actualizar el estado del estacionamiento' });
    }
  });

  
  // Ruta para modificar un vehículo de un usuario autenticado
  router.put('/updateauto/:id', middleware, async (req, res) => {
    const userId = req.user.userId;
    const { Placa, Marca, Modelo, Color } = req.body;
    const vehiculoId = req.params.id;
    
    try {
      const usuario = await User.findById(userId);
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

      // Emitir el evento de actualización a los clientes conectados
      io.emit('vehiculoActualizado', vehiculo);

      res.status(200).json({ message: 'Vehículo actualizado exitosamente', vehiculos: usuario.Vehiculos });
    } catch (err) {
      console.error('Error al actualizar el vehículo:', err);
      res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
  });
    


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


  router.post('/addauto', middleware, async (req, res) => {
    const { Placa, Marca, Modelo, Color } = req.body;

    // Verificar que todos los campos del vehículo estén presentes
    if (!Placa || !Marca || !Modelo || !Color) {
      return res.status(400).json({ error: 'Todos los campos del vehículo son obligatorios' });
    }

    try {
      const userId = req.user.userId;
      const usuario = await User.findById(userId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Agregar el nuevo vehículo sin imagen
      const newVehicle = { Placa, Marca, Modelo, Color };
      usuario.Vehiculos.push(newVehicle);

      await usuario.save();
      
      // Devolver el vehículo recién creado con su ID
      const createdVehicle = usuario.Vehiculos[usuario.Vehiculos.length - 1]; // El último vehículo agregado
      res.status(201).json(createdVehicle);

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

  // Configuración de Cloudinary
  cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Api_key,
    api_secret: process.env.Api_secret,
  });

  // Configuración de multer (almacena archivos en memoria)
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Ruta para subir una imagen a Cloudinary (para perfil o vehículo)
  router.post('/upload/:type/:vehiculoId?', middleware, upload.single('file'), async (req, res) => {
    const { type, vehiculoId } = req.params; // type será 'profile' o 'vehicle'
    const userId = req.user.userId;

    try {
      // Verificar que se haya subido un archivo
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

      // Verificar si es una imagen de perfil o de vehículo
      const usuario = await User.findById(userId);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (type === 'profile') {
        // Actualizar la imagen de perfil del usuario
        usuario.profileImage = response.secure_url;
        await usuario.save();

        res.status(200).json({
          message: 'Imagen de perfil subida y actualizada',
          user: usuario,
        });
      } else if (type === 'vehicle' && vehiculoId) {
        // Encontrar el vehículo y actualizar la imagen
        console.log(vehiculoId);
        const vehiculo = usuario.Vehiculos.id(vehiculoId);
        if (!vehiculo) {
          return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Agregar la URL de la imagen al vehículo (puedes agregar un campo "imagen" en el esquema del vehículo si no existe)
        vehiculo.Imagen = response.secure_url;
        await usuario.save();

        res.status(200).json({
          message: 'Imagen del vehículo subida y actualizada',
          vehiculo: vehiculo,
        });
      } else {
        res.status(400).json({ message: 'Tipo de subida inválido' });
      }

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
  return router;
};
