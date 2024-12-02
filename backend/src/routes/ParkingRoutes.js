// ParkingRoutes.js
const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const authorizeOperario = require('../middleware/authorizeOperario');
const ParkingReservation = require('../models/Reservas');
const middleware = require('../middleware/AuthMiddleware');
const User = require('../models/User'); // Importación añadida
const Operario = require('../models/Operarios'); // Importación añadida

module.exports = (io, transporter) => {

  // Función para enviar correos electrónicos
  const sendReservationEmail = (recipientEmail, reservationDetails, recipientName) => {
    const mailOptions = {
      from: `"Parking App" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Confirmación de Reserva',
      html: `
        <h1>Reserva Confirmada</h1>
        <p>Hola ${recipientName}, tu reserva ha sido confirmada con los siguientes detalles:</p>
        <ul>
          <li>Sección: ${reservationDetails.seccion}</li>
          <li>Número: ${reservationDetails.numero}</li>
          <li>Fecha de Reserva: ${reservationDetails.fechaReserva}</li>
          <li>Fecha de Expiración: ${reservationDetails.fechaExpiracion}</li>
        </ul>
        <p>Gracias por usar nuestro servicio.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });
  };

  // Ruta para obtener todas las reservas (solo para operarios)
  router.get('/reservations', authorizeOperario, async (req, res) => {
    try {
      const reservas = await ParkingReservation.find();
      res.status(200).json(reservas);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      res.status(500).json({ error: 'Error al obtener las reservas' });
    }
  });

  // Ruta para cancelar una reserva desde un operario
  router.put('/cancel-reservation/:id', authorizeOperario, async (req, res) => {
    const { id } = req.params;
    try {
      const reserva = await ParkingReservation.findById(id);
      if (!reserva) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      reserva.status = 'cancelled';
      await reserva.save();
      res.status(200).json({ message: 'Reserva cancelada', reserva });
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
  });

  // Crear una nueva reserva
  router.post('/reservas', middleware, async (req, res) => {
    const { seccion, numero, fechaReserva, fechaExpiracion } = req.body;
    const userId = req.user.userId; // Obtenemos el ID del usuario autenticado desde el middleware

    try {
      // Obtener detalles del usuario
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear la nueva reserva
      const newReservation = new ParkingReservation({
        seccion,
        numero,
        correo: user.UserEmail,
        id_usuario: userId,
        fechaReserva,
        fechaExpiracion,
        status: 'active'
      });

      await newReservation.save();

      // Enviar correo al usuario
      sendReservationEmail(user.UserEmail, newReservation, user.UserName);

      // Obtener todos los operarios
      const operators = await Operario.find();

      // Enviar correo a cada operario
      operators.forEach((operator) => {
        sendReservationEmail(operator.OperatorEmail, newReservation, operator.OperatorName);
      });

      res.status(201).json(newReservation);
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      res.status(500).json({ error: 'Error al crear la reserva' });
    }
  });

  // Obtener todas las reservas de un usuario autenticado
  router.get('/reservas', middleware, async (req, res) => {
    try {
      const reservas = await ParkingReservation.find({ id_usuario: req.user.userId });
      res.status(200).json(reservas);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      res.status(500).json({ error: 'Error al obtener las reservas' });
    }
  });

  // Actualizar una reserva
  router.put('/reservas/:id', middleware, async (req, res) => {
    const { id } = req.params;
    const { fechaExpiracion, status } = req.body;

    try {
      const reserva = await ParkingReservation.findById(id);

      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      if (reserva.id_usuario.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'No tienes permiso para actualizar esta reserva' });
      }

      reserva.fechaExpiracion = fechaExpiracion || reserva.fechaExpiracion;
      reserva.status = status || reserva.status;

      await reserva.save();
      res.status(200).json(reserva);
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
  });

  // Eliminar una reserva
  router.delete('/reservas/:id', middleware, async (req, res) => {
    const { id } = req.params;

    try {
      const reserva = await ParkingReservation.findById(id);

      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      if (reserva.id_usuario.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta reserva' });
      }

      await reserva.remove();
      res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
  });

 // Ruta para obtener todos los estacionamientos con detalles del usuario
  router.get('/parkings', async (req, res) => {
    try {
      // Obtener todos los estacionamientos y "populate" el campo "occupiedBy" con "name" y "email" del usuario
      const parkings = await Parking.find().populate('occupiedBy', 'name email'); 
      res.status(200).json(parkings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los estacionamientos' });
    }
  });

  

  // Ruta para obtener el número de espacios disponibles en tiempo real
  router.get('/available-spots', async (req, res) => {
    try {
      const parkings = await Parking.find(); // Obtener todos los estacionamientos
      const availableSpots = parkings.filter(p => !p.occupiedBy).length; // Filtrar los no ocupados
      res.status(200).json({ availableSpots });
      console.log('Espacios disponibles:', availableSpots);
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

  // Ruta para actualizar el estado de un estacionamiento
  router.put('/update-parking/:id', middleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const parking = await Parking.findById(id);
    if (!parking) {
      return res.status(404).json({ message: 'Estacionamiento no encontrado' });
    }

    if (parking.occupiedBy && parking.occupiedBy.toString() === userId) {
      // Si el usuario ya ocupa este estacionamiento, lo libera
      parking.occupiedBy = null;
    } else if (!parking.occupiedBy) {
      // Si el estacionamiento está libre, el usuario lo ocupa
      parking.occupiedBy = userId;
    } else {
      // Si el estacionamiento está ocupado por otro usuario
      return res.status(400).json({ message: 'El estacionamiento ya está ocupado por otro usuario' });
    }

    await parking.save();

    // Emitir la actualización a los clientes conectados
    emitirActualizacionEstacionamientos();

    res.status(200).json({ message: 'Estado del estacionamiento actualizado', parking });
  } catch (err) {
    console.error('Error al actualizar el estado del estacionamiento:', err);
    res.status(500).json({ error: 'Error al actualizar el estado del estacionamiento' });
  }
  });
  
  router.post('/assign-parking/:userId/:userName', async (req, res) => {
    const { userId, userName } = req.params;  // Información extraída de la URL
  
    if (!userId || !userName) {
      return res.status(400).json({ error: 'El ID y el nombre del usuario son requeridos' });
    }
  
    try {
      // Buscar un espacio disponible (solo por el campo status: 'enabled')
      const availableSpot = await Parking.findOne({
        status: 'enabled',  // Solo el status 'enabled', sin considerar 'occupiedBy'
      });
  
      if (!availableSpot) {
        return res.status(404).json({ error: 'No hay espacios de estacionamiento disponibles' });
      }
  
      // Asignar el espacio al usuario
      availableSpot.occupiedBy = userId;  // Asignar el ID del usuario
      availableSpot.status = 'disabled';  // Cambiar el estado del espacio a 'ocupado'
      await availableSpot.save();  // Guardar los cambios en la base de datos
  
      return res.status(200).json({
        message: 'Espacio asignado exitosamente',
        parkingSpot: {
          id: availableSpot._id,
          number: availableSpot.number,
          section: availableSpot.section,
        },
      });
    } catch (error) {
      console.error('Error al asignar el espacio de estacionamiento:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Ruta para liberar un espacio de estacionamiento (con userId en la URL)
  router.post('/free-parking/:userId', async (req, res) => {
    const { userId } = req.params;  // ID del usuario extraído de la URL
  
    if (!userId) {
      return res.status(400).json({ error: 'El ID del usuario es requerido' });
    }
  
    try {
      // Buscar el espacio ocupado por este usuario
      const occupiedSpot = await Parking.findOne({ occupiedBy: userId });
  
      if (!occupiedSpot) {
        return res.status(404).json({ error: 'No se encontró un espacio ocupado por este usuario' });
      }
  
      // Liberar el espacio
      occupiedSpot.occupiedBy = null;  // Eliminar al usuario del espacio
      occupiedSpot.status = 'enabled';  // Cambiar el estado del espacio a 'habilitado' (libre)
      await occupiedSpot.save();  // Guardar los cambios en la base de datos
  
      return res.status(200).json({ message: 'Espacio liberado exitosamente' });
    } catch (error) {
      console.error('Error al liberar el espacio de estacionamiento:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

    // Verificar si un usuario tiene un espacio asignado
  router.get('/check-parking/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const assignedParking = await Parking.findOne({ occupiedBy: userId });

      if (assignedParking) {
        return res.status(200).json({ hasParking: true, parkingDetails: assignedParking });
      } else {
        return res.status(200).json({ hasParking: false });
      }
    } catch (error) {
      console.error('Error al verificar el espacio de estacionamiento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  return router;
};
