import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Mapa from './components/Mapa';
import ListaVehiculos from './components/ListaVehiculos';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(API_URL);

export default function App() {
  const [vehiculos, setVehiculos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [conectado, setConectado] = useState(false);

  // Cargar vehículos al iniciar
  useEffect(() => {
    cargarVehiculos();

    socket.on('connect', () => {
      setConectado(true);
      socket.emit('admin_conectado');
    });

    socket.on('disconnect', () => setConectado(false));

    // Actualizar posición en tiempo real cuando llega dato nuevo
    socket.on('ubicacion_actualizada', (dato) => {
      setVehiculos((prev) =>
        prev.map((v) =>
          v.id === dato.vehiculo_id
            ? { ...v, latitud: dato.latitud, longitud: dato.longitud, velocidad: dato.velocidad }
            : v
        )
      );
    });

    return () => socket.off('ubicacion_actualizada');
  }, []);

  async function cargarVehiculos() {
    try {
      const res = await axios.get(`${API_URL}/api/vehicles`);
      setVehiculos(res.data.datos);
    } catch (err) {
      console.error('Error cargando vehículos:', err);
    }
  }

  return (
    <div style={estilos.contenedor}>
      {/* Barra superior */}
      <div style={estilos.barra}>
        <h1 style={estilos.titulo}>🚌 Monitor de Flota</h1>
        <span style={{ ...estilos.estado, background: conectado ? '#22c55e' : '#ef4444' }}>
          {conectado ? '● En vivo' : '● Desconectado'}
        </span>
      </div>

      {/* Contenido principal */}
      <div style={estilos.cuerpo}>
        {/* Panel izquierdo: lista de vehículos */}
        <ListaVehiculos
          vehiculos={vehiculos}
          seleccionado={seleccionado}
          onSeleccionar={setSeleccionado}
        />

        {/* Mapa principal */}
        <div style={estilos.mapaContenedor}>
          <Mapa vehiculos={vehiculos} seleccionado={seleccionado} />
        </div>
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#1a1a2e'
  },
  barra: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#16213e',
    borderBottom: '1px solid #0f3460'
  },
  titulo: {
    fontSize: '20px',
    color: '#e94560',
    fontWeight: 'bold'
  },
  estado: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    color: 'white',
    fontWeight: 'bold'
  },
  cuerpo: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  mapaContenedor: {
    flex: 1
  }
};
