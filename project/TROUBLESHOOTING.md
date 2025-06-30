# 🔧 Guía de Solución de Problemas

## 🚨 Problemas Comunes y Soluciones

### 1. 🔌 Problemas de Conexión WebSocket

#### Síntoma: "Socket no conecta" o "Desconectado del servidor"

**Posibles Causas:**
- Servidor backend no está ejecutándose
- Puerto incorrecto en la configuración
- Firewall bloqueando conexiones
- CORS mal configurado

**Soluciones:**

1. **Verificar que el servidor esté ejecutándose:**
```bash
# En desarrollo
npm run dev:server

# Verificar que aparezca:
# 🚀 Servidor ejecutándose en puerto 3001
```

2. **Verificar configuración de Socket.IO:**
```typescript
// src/contexts/SocketContext.tsx
// Para desarrollo:
const newSocket = io('http://localhost:3001');

// Para producción:
const newSocket = io(window.location.origin);
```

3. **Verificar CORS en el servidor:**
```javascript
// server/index.js
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Desarrollo
    // origin: "https://tu-dominio.com", // Producción
    methods: ["GET", "POST"]
  }
});
```

### 2. 🔊 Sonidos No Reproducen

#### Síntoma: No se escuchan notificaciones de audio

**Posibles Causas:**
- Archivos de audio no encontrados
- Navegador bloquea autoplay
- Volumen del sistema silenciado
- Permisos de audio denegados

**Soluciones:**

1. **Verificar archivos de audio:**
```bash
# Verificar que existan estos archivos:
ls public/sounds/
# Debe mostrar:
# gentle-notification.mp3
# kitchen-bell.mp3
# new-order.mp3
# order-ready.mp3
# success-chime.mp3
```

2. **Verificar permisos del navegador:**
- Chrome: Configuración → Privacidad y seguridad → Configuración del sitio → Sonido
- Firefox: about:preferences#privacy → Permisos → Reproducción automática

3. **Probar sonidos manualmente:**
```javascript
// En la consola del navegador:
const audio = new Audio('/sounds/kitchen-bell.mp3');
audio.play();
```

### 3. 📱 Problemas de Responsive Design

#### Síntoma: La interfaz no se ve bien en móviles

**Soluciones:**

1. **Verificar viewport meta tag:**
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. **Verificar clases de Tailwind:**
```jsx
// Usar clases responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

3. **Probar en diferentes dispositivos:**
- Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Probar en iPhone, Android, iPad

### 4. 🗄️ Problemas de Base de Datos

#### Síntoma: "Error saving order" o datos no persisten

**Posibles Causas:**
- Base de datos en memoria se reinicia
- Errores de SQL
- Permisos de escritura

**Soluciones:**

1. **Para persistencia, cambiar a archivo:**
```javascript
// server/index.js
// Cambiar de:
const db = new sqlite3.Database(':memory:');

// A:
const db = new sqlite3.Database('./restaurant.db');
```

2. **Verificar logs del servidor:**
```bash
npm run dev:server
# Buscar errores como:
# Error saving order: SQLITE_ERROR
```

3. **Reinicializar base de datos:**
```bash
# Si usas archivo de BD, eliminar y recrear:
rm restaurant.db
npm run dev:server
```

### 5. 🎨 Problemas de Estilos

#### Síntoma: Estilos no se aplican correctamente

**Soluciones:**

1. **Verificar que Tailwind esté configurado:**
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. **Limpiar caché de Vite:**
```bash
rm -rf node_modules/.vite
npm run dev
```

3. **Verificar configuración de Tailwind:**
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // ...
};
```

### 6. 🔄 Problemas de Build

#### Síntoma: "Build failed" o errores de compilación

**Soluciones:**

1. **Verificar dependencias:**
```bash
npm install
# Si hay conflictos:
rm -rf node_modules package-lock.json
npm install
```

2. **Verificar errores de TypeScript:**
```bash
npx tsc --noEmit
```

3. **Verificar imports:**
```typescript
// Verificar que todos los imports sean correctos
import { Component } from './Component'; // ✅
import { Component } from './component'; // ❌ (case sensitive)
```

### 7. 🚀 Problemas de Despliegue en Railway

#### Síntoma: "Application failed to respond"

**Soluciones:**

1. **Verificar railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Verificar scripts en package.json:**
```json
{
  "scripts": {
    "start": "node server/index.js",
    "start:prod": "npm run build && npm run start",
    "build": "vite build"
  }
}
```

3. **Verificar logs en Railway:**
- Dashboard → Tu proyecto → Deployments → Ver logs

### 8. 📊 QR Codes No Generan

#### Síntoma: Error al generar códigos QR

**Soluciones:**

1. **Verificar dependencia:**
```bash
npm install qrcode @types/qrcode
```

2. **Verificar permisos de canvas:**
```javascript
// Algunos navegadores requieren interacción del usuario
// Asegurar que la generación se haga después de un click
```

3. **Verificar URL base:**
```javascript
// TableManagement.tsx
const url = `${window.location.origin}/menu/${tableNumber}`;
```

## 🔍 Herramientas de Debugging

### 1. Logs del Servidor
```bash
# Ver logs en tiempo real
npm run dev:server

# Buscar patrones específicos:
npm run dev:server | grep "ERROR"
npm run dev:server | grep "pedido"
```

### 2. DevTools del Navegador

#### Console
```javascript
// Verificar conexión Socket.IO
window.socket = io('http://localhost:3001');
window.socket.on('connect', () => console.log('Conectado!'));

// Verificar estado de la aplicación
console.log('Orders:', window.orders);
```

#### Network Tab
- Verificar requests fallidos
- Verificar WebSocket connection
- Verificar carga de assets (sonidos, imágenes)

#### Application Tab
- LocalStorage/SessionStorage
- Service Workers
- Cookies

### 3. React DevTools
- Instalar extensión React DevTools
- Verificar props y state de componentes
- Profiler para performance

## 🚨 Códigos de Error Específicos

### E001: Socket Connection Failed
```
Error: Socket connection failed
Causa: Servidor no disponible o CORS mal configurado
Solución: Verificar servidor y configuración CORS
```

### E002: Audio Playback Failed
```
Error: NotAllowedError: play() failed
Causa: Navegador bloquea autoplay
Solución: Requerir interacción del usuario primero
```

### E003: Database Error
```
Error: SQLITE_ERROR: no such table
Causa: Base de datos no inicializada
Solución: Reiniciar servidor para recrear tablas
```

### E004: Build Error
```
Error: Module not found
Causa: Import incorrecto o dependencia faltante
Solución: Verificar imports y ejecutar npm install
```

## 📞 Obtener Ayuda

### 1. Información del Sistema
Antes de reportar un problema, recopila:

```bash
# Versión de Node.js
node --version

# Versión de npm
npm --version

# Sistema operativo
uname -a  # Linux/Mac
systeminfo  # Windows

# Logs del error
npm run dev 2>&1 | tee debug.log
```

### 2. Reproducir el Error
1. Describe los pasos exactos para reproducir
2. Incluye screenshots si es visual
3. Menciona navegador y versión
4. Indica si es en desarrollo o producción

### 3. Información de Contexto
- ¿Cuándo empezó el problema?
- ¿Qué cambios se hicieron recientemente?
- ¿Funciona en otros dispositivos/navegadores?
- ¿Hay mensajes de error específicos?

## 🔧 Comandos de Diagnóstico

### Verificación Completa del Sistema
```bash
#!/bin/bash
echo "=== Diagnóstico del Sistema de Pedidos ==="

echo "1. Verificando Node.js..."
node --version

echo "2. Verificando dependencias..."
npm list --depth=0

echo "3. Verificando puertos..."
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173

echo "4. Verificando archivos críticos..."
ls -la railway.json package.json server/index.js

echo "5. Verificando sonidos..."
ls -la public/sounds/

echo "6. Probando build..."
npm run build

echo "=== Diagnóstico Completo ==="
```

### Script de Limpieza
```bash
#!/bin/bash
echo "Limpiando proyecto..."

# Limpiar node_modules
rm -rf node_modules package-lock.json

# Limpiar caché de Vite
rm -rf node_modules/.vite

# Limpiar dist
rm -rf dist

# Reinstalar dependencias
npm install

echo "Proyecto limpiado y dependencias reinstaladas"
```

## ✅ Checklist de Verificación

Antes de desplegar o reportar problemas:

- [ ] ✅ Servidor backend inicia sin errores
- [ ] ✅ Frontend se carga correctamente
- [ ] ✅ WebSocket conecta exitosamente
- [ ] ✅ Sonidos reproducen correctamente
- [ ] ✅ QR codes se generan sin errores
- [ ] ✅ Base de datos guarda pedidos
- [ ] ✅ Responsive funciona en móviles
- [ ] ✅ Build de producción exitoso
- [ ] ✅ Todas las rutas accesibles
- [ ] ✅ No hay errores en console

---

Si después de seguir esta guía el problema persiste, crea un issue en GitHub con toda la información de diagnóstico recopilada.