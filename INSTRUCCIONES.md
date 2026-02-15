# Monitor de Flota - Instrucciones de instalación

## PASO 1: Crear la base de datos en SQL Server

1. Abre SQL Server Management Studio (SSMS)
2. Conéctate con Autenticación de Windows
3. Abre el archivo `database.sql` (está en esta carpeta)
4. Ejecuta el script completo (F5 o botón "Ejecutar")

---

## PASO 2: Instalar y ejecutar el Backend

Abre una terminal en la carpeta `backend/`:

```bash
cd backend
npm install
npm run dev
```

Deberías ver:
```
✅ Conectado a SQL Server correctamente
🚀 Servidor corriendo en http://localhost:3001
```

---

## PASO 3: Instalar y ejecutar el Dashboard Web

Abre OTRA terminal en la carpeta `web-dashboard/`:

```bash
cd web-dashboard
npm install
npm run dev
```

Abre en el navegador: **http://localhost:3000**

---

## PASO 4: Instalar y ejecutar la App Móvil

### Primero instala Expo CLI (solo una vez):
```bash
npm install -g expo-cli
```

### Luego en la carpeta `mobile-app/`:
```bash
cd mobile-app
npm install
npx expo start
```

### Configura la IP del servidor:
1. Abre CMD y escribe `ipconfig`
2. Copia tu dirección IPv4 (algo como 192.168.1.X)
3. Edita el archivo `mobile-app/config.js` y reemplaza la IP

### Para probar en tu celular:
1. Descarga la app **Expo Go** en tu Android/iPhone (gratis)
2. Escanea el código QR que aparece en la terminal
3. La app se abrirá en tu celular

---

## Estructura del proyecto

```
fleet-monitor/
├── backend/          → Servidor Node.js + API + WebSockets
├── web-dashboard/    → Panel admin en el navegador
├── mobile-app/       → App para el conductor (Android/iOS)
└── database.sql      → Script para crear la BD en SQL Server
```
