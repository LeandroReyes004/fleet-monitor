function iniciarSockets(io) {
  io.on('connection', (socket) => {
    console.log(`📱 Cliente conectado: ${socket.id}`);

    // El conductor se identifica con su vehículo
    socket.on('conductor_conectado', (datos) => {
      console.log(`🚌 Conductor del vehículo ${datos.vehiculo_id} conectado`);
      socket.join(`vehiculo_${datos.vehiculo_id}`);
    });

    // El admin se une a la sala general
    socket.on('admin_conectado', () => {
      console.log(`👨‍💼 Administrador conectado`);
      socket.join('admins');
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
}

module.exports = { iniciarSockets };
