const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// POST /api/location - El conductor envía su posición GPS
router.post('/', async (req, res) => {
  const { vehiculo_id, latitud, longitud, velocidad } = req.body;

  if (!vehiculo_id || !latitud || !longitud) {
    return res.status(400).json({ ok: false, error: 'Faltan datos de ubicación' });
  }

  try {
    await query(
      `INSERT INTO ubicaciones (vehiculo_id, latitud, longitud, velocidad, fecha_hora)
       VALUES ($1, $2, $3, $4, NOW())`,
      [vehiculo_id, latitud, longitud, velocidad || 0]
    );

    const io = req.app.get('io');
    io.emit('ubicacion_actualizada', {
      vehiculo_id,
      latitud,
      longitud,
      velocidad: velocidad || 0,
      fecha_hora: new Date()
    });

    res.json({ ok: true, mensaje: 'Ubicación guardada' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/location/history/:vehiculoId - Historial de ruta
router.get('/history/:vehiculoId', async (req, res) => {
  const { fecha } = req.query;
  try {
    let consulta = `
      SELECT latitud, longitud, velocidad, fecha_hora
      FROM ubicaciones
      WHERE vehiculo_id = $1
    `;
    const params = [req.params.vehiculoId];

    if (fecha) {
      consulta += ' AND fecha_hora::date = $2';
      params.push(fecha);
    }

    consulta += ' ORDER BY fecha_hora ASC';

    const resultado = await query(consulta, params);
    res.json({ ok: true, datos: resultado.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
