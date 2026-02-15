const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/vehicles - Todos los vehículos con su última posición
router.get('/', async (req, res) => {
  try {
    const resultado = await query(`
      SELECT
        v.id, v.nombre, v.placa, v.conductor, v.estado,
        l.latitud, l.longitud, l.velocidad,
        l.fecha_hora AS ultima_actualizacion
      FROM vehiculos v
      LEFT JOIN (
        SELECT vehiculo_id, latitud, longitud, velocidad, fecha_hora,
               ROW_NUMBER() OVER (PARTITION BY vehiculo_id ORDER BY fecha_hora DESC) AS rn
        FROM ubicaciones
      ) l ON v.id = l.vehiculo_id AND l.rn = 1
    `);
    res.json({ ok: true, datos: resultado.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/vehicles/:id - Un vehículo específico
router.get('/:id', async (req, res) => {
  try {
    const resultado = await query(
      'SELECT * FROM vehiculos WHERE id = $1',
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Vehículo no encontrado' });
    }
    res.json({ ok: true, datos: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/vehicles - Agregar nuevo vehículo
router.post('/', async (req, res) => {
  const { nombre, placa, conductor } = req.body;
  try {
    await query(
      `INSERT INTO vehiculos (nombre, placa, conductor, estado)
       VALUES ($1, $2, $3, 'activo')`,
      [nombre, placa, conductor]
    );
    res.json({ ok: true, mensaje: 'Vehículo agregado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PUT /api/vehicles/:id/estado - Cambiar estado
router.put('/:id/estado', async (req, res) => {
  const { estado } = req.body;
  try {
    await query(
      'UPDATE vehiculos SET estado = $1 WHERE id = $2',
      [estado, req.params.id]
    );
    res.json({ ok: true, mensaje: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
