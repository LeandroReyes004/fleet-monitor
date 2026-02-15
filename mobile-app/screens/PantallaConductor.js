import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, AppState
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { SERVIDOR_URL, INTERVALO_GPS } from '../config';

export default function PantallaConductor({ route }) {
  const { vehiculo } = route.params;
  const [enRuta, setEnRuta] = useState(false);
  const [ubicacion, setUbicacion] = useState(null);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);
  const [totalEnvios, setTotalEnvios] = useState(0);
  const intervalo = useRef(null);

  useEffect(() => {
    solicitarPermisos();
    return () => detenerRuta();
  }, []);

  async function solicitarPermisos() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso de GPS requerido',
        'La app necesita acceso al GPS para funcionar correctamente.'
      );
    }
  }

  async function obtenerYEnviarUbicacion() {
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude, speed } = pos.coords;
      setUbicacion({ latitude, longitude });

      // Enviar al servidor
      await axios.post(`${SERVIDOR_URL}/api/location`, {
        vehiculo_id: vehiculo.id,
        latitud: latitude,
        longitud: longitude,
        velocidad: speed ? (speed * 3.6).toFixed(1) : 0 // m/s → km/h
      });

      setUltimoEnvio(new Date());
      setTotalEnvios((prev) => prev + 1);
    } catch (err) {
      console.error('Error enviando ubicación:', err.message);
    }
  }

  function iniciarRuta() {
    setEnRuta(true);
    obtenerYEnviarUbicacion(); // Enviar inmediatamente
    intervalo.current = setInterval(obtenerYEnviarUbicacion, INTERVALO_GPS);
  }

  function detenerRuta() {
    setEnRuta(false);
    if (intervalo.current) {
      clearInterval(intervalo.current);
      intervalo.current = null;
    }
  }

  function toggleRuta() {
    if (enRuta) {
      Alert.alert(
        'Finalizar ruta',
        '¿Deseas detener el envío de ubicación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', onPress: detenerRuta, style: 'destructive' }
        ]
      );
    } else {
      iniciarRuta();
    }
  }

  return (
    <View style={estilos.contenedor}>
      {/* Info del vehículo */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.vehiculoNombre}>{vehiculo.nombre}</Text>
        <Text style={estilos.vehiculoInfo}>🪪 {vehiculo.placa}</Text>
        <Text style={estilos.vehiculoInfo}>👤 {vehiculo.conductor}</Text>
      </View>

      {/* Estado del GPS */}
      <View style={estilos.tarjeta}>
        <View style={estilos.fila}>
          <Text style={estilos.label}>Estado:</Text>
          <View style={[estilos.indicador, { backgroundColor: enRuta ? '#22c55e' : '#888' }]}>
            <Text style={estilos.indicadorTexto}>
              {enRuta ? '● Transmitiendo' : '● Detenido'}
            </Text>
          </View>
        </View>

        {ubicacion && (
          <>
            <View style={estilos.fila}>
              <Text style={estilos.label}>📍 Latitud:</Text>
              <Text style={estilos.valor}>{ubicacion.latitude.toFixed(6)}</Text>
            </View>
            <View style={estilos.fila}>
              <Text style={estilos.label}>📍 Longitud:</Text>
              <Text style={estilos.valor}>{ubicacion.longitude.toFixed(6)}</Text>
            </View>
          </>
        )}

        {ultimoEnvio && (
          <View style={estilos.fila}>
            <Text style={estilos.label}>⏱ Último envío:</Text>
            <Text style={estilos.valor}>
              {ultimoEnvio.toLocaleTimeString()}
            </Text>
          </View>
        )}

        <View style={estilos.fila}>
          <Text style={estilos.label}>📡 Total envíos:</Text>
          <Text style={estilos.valor}>{totalEnvios}</Text>
        </View>
      </View>

      {/* Botón principal */}
      <TouchableOpacity
        style={[estilos.boton, enRuta ? estilos.botonDetener : estilos.botonIniciar]}
        onPress={toggleRuta}
      >
        <Text style={estilos.botonTexto}>
          {enRuta ? '⏹ Finalizar Ruta' : '▶ Iniciar Ruta'}
        </Text>
      </TouchableOpacity>

      <Text style={estilos.nota}>
        El GPS se envía automáticamente cada {INTERVALO_GPS / 1000} segundos
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  tarjeta: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16
  },
  vehiculoNombre: { color: '#e94560', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  vehiculoInfo: { color: '#aaa', fontSize: 14, marginTop: 2 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  label: { color: '#aaa', fontSize: 14 },
  valor: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  indicador: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20
  },
  indicadorTexto: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  boton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  botonIniciar: { backgroundColor: '#22c55e' },
  botonDetener: { backgroundColor: '#ef4444' },
  botonTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  nota: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 16 }
});
