// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/AuthMiddleware');

// Exportar una función que recibe `io`
module.exports = (io) => {

  // Ejemplo de ruta que utiliza `io`
  router.put('/reservar/:id', middleware, async (req, res) => {
    const { id } = req.params;
    try {
      const espacio = await Parking.findById(id);
      if (!espacio) {
        return res.status(404).json({ message: 'Estacionamiento no encontrado' });
      }

      espacio.occupiedBy = espacio.occupiedBy ? null : 'userId';
      await espacio.save();

      // Emitir la actualización a todos los clientes conectados
      io.emit('actualizarEstacionamientos', await Parking.find());

      res.status(200).json({ message: 'Estacionamiento actualizado', espacio });
    } catch (error) {
      console.error('Error al actualizar el estacionamiento:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
  router.get('/protected', middleware, (req, res) => {
    res.send({ message: 'This is a protected route', user: req.user });
  });
  
  return router; // Devuelve el router configurado
};
