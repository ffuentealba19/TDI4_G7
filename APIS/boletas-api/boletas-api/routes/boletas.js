const express = require('express');
const router = express.Router();
const Boleta = require('../models/Boleta');

// Crear una nueva boleta
router.post('/crear', async (req, res) => {
  const { 
    numero, nombreORazonSocial, rut, domicilio, giro, timbreSII, totalConIVA, datosComprador 
  } = req.body;

  try {
    // Validar que no haya centavos
    const totalSinCentavos = Math.floor(totalConIVA);
    if (totalConIVA !== totalSinCentavos) {
      return res.status(400).json({ mensaje: 'El total no debe contener centavos' });
    }

    const nuevaBoleta = new Boleta({
      numero,
      nombreORazonSocial,
      rut,
      domicilio,
      giro,
      timbreSII,
      totalConIVA: totalSinCentavos, // Guardamos el valor sin centavos
      datosComprador
    });

    const boletaGuardada = await nuevaBoleta.save();
    res.json(boletaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la boleta', error });
  }
});

// Obtener todas las boletas
router.get('/', async (req, res) => {
  try {
    const boletas = await Boleta.find();
    res.json(boletas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las boletas' });
  }
});

// Obtener una boleta por su ID
router.get('/:id', async (req, res) => {
  try {
    const boleta = await Boleta.findById(req.params.id);
    if (!boleta) {
      return res.status(404).json({ mensaje: 'Boleta no encontrada' });
    }
    res.json(boleta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la boleta' });
  }
});

// Actualizar una boleta
router.put('/:id', async (req, res) => {
  try {
    const boletaActualizada = await Boleta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!boletaActualizada) {
      return res.status(404).json({ mensaje: 'Boleta no encontrada' });
    }
    res.json(boletaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la boleta' });
  }
});

// Eliminar una boleta
router.delete('/:id', async (req, res) => {
  try {
    const boletaEliminada = await Boleta.findByIdAndDelete(req.params.id);
    if (!boletaEliminada) {
      return res.status(404).json({ mensaje: 'Boleta no encontrada' });
    }
    res.json({ mensaje: 'Boleta eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la boleta' });
  }
});

module.exports = router;
