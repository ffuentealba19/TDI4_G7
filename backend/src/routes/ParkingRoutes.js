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

  return router;
};
