import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix icono por defecto de Leaflet (problema conocido con Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Icono personalizado por estado
function crearIcono(estado) {
  const colores = {
    activo: '#22c55e',
    detenido: '#f59e0b',
    fuera_servicio: '#ef4444'
  };
  const color = colores[estado] || '#3b82f6';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: ${color};
        width: 36px; height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">🚌</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
}

// Componente para centrar el mapa cuando se selecciona un vehículo
function CentrarMapa({ seleccionado }) {
  const map = useMap();
  if (seleccionado?.latitud && seleccionado?.longitud) {
    map.flyTo([seleccionado.latitud, seleccionado.longitud], 16, { duration: 1 });
  }
  return null;
}

export default function Mapa({ vehiculos, seleccionado }) {
  // Centro por defecto (puedes cambiar estas coordenadas a tu ciudad)
  const centroInicial = [14.6349, -90.5069];

  const vehiculosConUbicacion = vehiculos.filter((v) => v.latitud && v.longitud);

  return (
    <MapContainer
      center={centroInicial}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      {/* Mapa base gratuito de OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador por cada vehículo */}
      {vehiculosConUbicacion.map((vehiculo) => (
        <Marker
          key={vehiculo.id}
          position={[vehiculo.latitud, vehiculo.longitud]}
          icon={crearIcono(vehiculo.estado)}
        >
          <Popup>
            <div style={{ minWidth: '160px' }}>
              <strong style={{ fontSize: '15px' }}>{vehiculo.nombre}</strong>
              <br />
              <span>🪪 Placa: {vehiculo.placa}</span><br />
              <span>👤 Conductor: {vehiculo.conductor}</span><br />
              <span>⚡ Velocidad: {vehiculo.velocidad?.toFixed(1) || 0} km/h</span><br />
              <span style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '2px 8px',
                borderRadius: '10px',
                background: vehiculo.estado === 'activo' ? '#22c55e' : '#f59e0b',
                color: 'white',
                fontSize: '12px'
              }}>
                {vehiculo.estado}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Centrar mapa al seleccionar vehículo */}
      {seleccionado && <CentrarMapa seleccionado={seleccionado} />}
    </MapContainer>
  );
}
