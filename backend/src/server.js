require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { conectar } = require('./config/database');
const { iniciarSockets } = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Pasar io a las rutas
app.set('io', io);

// Rutas API
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/location', require('./routes/locations'));

// Ruta de estado del servidor
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Servidor de monitoreo de flota funcionando',
    hora: new Date()
  });
});

// Iniciar WebSockets
iniciarSockets(io);

// Conectar a BD e iniciar servidor
const PORT = process.env.PORT || 3001;

conectar()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 WebSockets activos`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api/status`);
    });
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a la base de datos:');
    console.error('   Mensaje:', err.message);
    console.error('   DATABASE_URL configurada:', process.env.DATABASE_URL ? 'SÍ' : 'NO');
    process.exit(1);
  });
