import React from 'react';

const coloresEstado = {
  activo: '#22c55e',
  detenido: '#f59e0b',
  fuera_servicio: '#ef4444'
};

export default function ListaVehiculos({ vehiculos, seleccionado, onSeleccionar }) {
  return (
    <div style={estilos.panel}>
      <h2 style={estilos.titulo}>🚌 Flota ({vehiculos.length})</h2>

      <div style={estilos.lista}>
        {vehiculos.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
            Cargando vehículos...
          </p>
        )}

        {vehiculos.map((v) => (
          <div
            key={v.id}
            onClick={() => onSeleccionar(v)}
            style={{
              ...estilos.tarjeta,
              border: seleccionado?.id === v.id
                ? '2px solid #e94560'
                : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            {/* Indicador de estado */}
            <div style={estilos.fila}>
              <span style={estilos.nombre}>{v.nombre}</span>
              <span style={{
                ...estilos.badge,
                background: coloresEstado[v.estado] || '#888'
              }}>
                {v.estado}
              </span>
            </div>

            <div style={estilos.info}>
              <span>🪪 {v.placa}</span>
              <span>👤 {v.conductor || 'Sin conductor'}</span>
            </div>

            {v.latitud && (
              <div style={estilos.info}>
                <span>⚡ {v.velocidad?.toFixed(1) || 0} km/h</span>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  📍 {v.latitud?.toFixed(4)}, {v.longitud?.toFixed(4)}
                </span>
              </div>
            )}

            {!v.latitud && (
              <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                📍 Sin ubicación disponible
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const estilos = {
  panel: {
    width: '280px',
    minWidth: '280px',
    background: '#16213e',
    borderRight: '1px solid #0f3460',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  titulo: {
    padding: '16px',
    fontSize: '16px',
    color: '#e94560',
    borderBottom: '1px solid #0f3460'
  },
  lista: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px'
  },
  tarjeta: {
    background: '#0f3460',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    transition: 'border 0.2s'
  },
  fila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#eee'
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    color: 'white',
    fontWeight: 'bold'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#aaa',
    marginTop: '3px'
  }
};
