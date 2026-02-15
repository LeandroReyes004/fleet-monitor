import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import axios from 'axios';
import { SERVIDOR_URL } from '../config';

export default function PantallaLogin({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function cargarVehiculos() {
    try {
      const res = await axios.get(`${SERVIDOR_URL}/api/vehicles`);
      setVehiculos(res.data.datos);
    } catch (err) {
      Alert.alert(
        'Error de conexión',
        `No se puede conectar al servidor.\nVerifica que el backend esté corriendo en:\n${SERVIDOR_URL}`
      );
    } finally {
      setCargando(false);
    }
  }

  function iniciarRuta() {
    if (!vehiculoSeleccionado) {
      Alert.alert('Selecciona tu vehículo', 'Elige el vehículo que vas a manejar.');
      return;
    }
    navigation.navigate('Conductor', { vehiculo: vehiculoSeleccionado });
  }

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={estilos.texto}>Conectando al servidor...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Selecciona tu vehículo</Text>

      <ScrollView style={estilos.lista}>
        {vehiculos.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[
              estilos.tarjeta,
              vehiculoSeleccionado?.id === v.id && estilos.tarjetaActiva
            ]}
            onPress={() => setVehiculoSeleccionado(v)}
          >
            <Text style={estilos.nombreVehiculo}>{v.nombre}</Text>
            <Text style={estilos.infoVehiculo}>🪪 {v.placa}</Text>
            <Text style={estilos.infoVehiculo}>👤 {v.conductor || 'Sin conductor asignado'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[estilos.boton, !vehiculoSeleccionado && estilos.botonDeshabilitado]}
        onPress={iniciarRuta}
        disabled={!vehiculoSeleccionado}
      >
        <Text style={estilos.botonTexto}>🚀 Iniciar Ruta</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  titulo: { color: '#e94560', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  texto: { color: '#aaa', marginTop: 10 },
  lista: { flex: 1, marginBottom: 16 },
  tarjeta: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  tarjetaActiva: { borderColor: '#e94560' },
  nombreVehiculo: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  infoVehiculo: { color: '#aaa', fontSize: 13, marginTop: 2 },
  boton: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  botonDeshabilitado: { backgroundColor: '#555' },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
