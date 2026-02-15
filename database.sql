-- =============================================
-- Script de base de datos: Fleet Monitor
-- Para PostgreSQL - Ejecutar en pgAdmin
-- =============================================

-- PASO 1: Crear la base de datos
-- (Click derecho en "Databases" > Create > Database > nombre: fleetmonitor)
-- O ejecuta esto en la consola de pgAdmin conectado a "postgres":
-- CREATE DATABASE fleetmonitor;

-- PASO 2: Conectarte a la base "fleetmonitor" y ejecutar lo siguiente:

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  placa     VARCHAR(20)  NOT NULL UNIQUE,
  conductor VARCHAR(100),
  estado    VARCHAR(20)  DEFAULT 'activo'
);

-- Tabla de ubicaciones GPS (historial completo)
CREATE TABLE IF NOT EXISTS ubicaciones (
  id          SERIAL PRIMARY KEY,
  vehiculo_id INT NOT NULL,
  latitud     FLOAT NOT NULL,
  longitud    FLOAT NOT NULL,
  velocidad   FLOAT DEFAULT 0,
  fecha_hora  TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
);

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_ubicaciones_vehiculo_fecha
ON ubicaciones (vehiculo_id, fecha_hora DESC);

-- =============================================
-- Datos de prueba
-- =============================================
INSERT INTO vehiculos (nombre, placa, conductor, estado) VALUES
  ('Bus Ruta 1',  'ABC-001', 'Juan Pérez',    'activo'),
  ('Bus Ruta 2',  'ABC-002', 'María López',   'activo'),
  ('Bus Ruta 3',  'ABC-003', 'Carlos García', 'activo'),
  ('Camioneta 1', 'XYZ-010', 'Ana Torres',    'activo'),
  ('Camioneta 2', 'XYZ-011', 'Pedro Ruiz',    'detenido');

INSERT INTO ubicaciones (vehiculo_id, latitud, longitud, velocidad) VALUES
  (1, 14.6349, -90.5069, 45.5),
  (2, 14.6420, -90.5130, 32.0),
  (3, 14.6280, -90.4980, 55.0),
  (4, 14.6510, -90.5200, 28.0),
  (5, 14.6380, -90.5050,  0.0);

SELECT 'Base de datos FleetMonitor creada correctamente' AS resultado;
