import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PantallaLogin from './screens/PantallaLogin';
import PantallaConductor from './screens/PantallaConductor';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#16213e' },
            headerTintColor: '#e94560',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#1a1a2e' }
          }}
        >
          <Stack.Screen
            name="Login"
            component={PantallaLogin}
            options={{ title: '🚌 Monitor de Flota' }}
          />
          <Stack.Screen
            name="Conductor"
            component={PantallaConductor}
            options={{ title: 'Ruta en curso', headerBackVisible: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
