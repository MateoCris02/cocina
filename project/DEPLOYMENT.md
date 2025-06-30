# 🚀 Guía de Despliegue en Railway

Esta guía te llevará paso a paso para desplegar tu sistema de pedidos en Railway de manera exitosa.

## 📋 Pre-requisitos

- [ ] Cuenta en [GitHub](https://github.com)
- [ ] Cuenta en [Railway](https://railway.app)
- [ ] Código del proyecto en un repositorio de GitHub

## 🔧 Preparación del Proyecto

### 1. Verificar Archivos de Configuración

Asegúrate de que estos archivos estén en la raíz de tu proyecto:

#### `railway.json`
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

#### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start:prod"
```

### 2. Verificar package.json

Confirma que tienes estos scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "vite",
    "dev:server": "nodemon server/index.js",
    "build": "vite build",
    "build:server": "echo 'Server build complete'",
    "start": "node server/index.js",
    "start:prod": "npm run build && npm run start"
  }
}
```

## 🌐 Proceso de Despliegue

### Paso 1: Subir Código a GitHub

```bash
# Si no has inicializado git
git init
git add .
git commit -m "Initial commit - Restaurant ordering system"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Proyecto en Railway

1. **Acceder a Railway**
   - Ve a [railway.app](https://railway.app)
   - Inicia sesión con GitHub

2. **Crear Nuevo Proyecto**
   - Clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway para acceder a tus repositorios

3. **Seleccionar Repositorio**
   - Busca tu repositorio del sistema de pedidos
   - Clic en "Deploy Now"

### Paso 3: Configuración Automática

Railway detectará automáticamente:
- ✅ Node.js como runtime
- ✅ Nixpacks como builder
- ✅ Puerto dinámico
- ✅ Comandos de build y start

### Paso 4: Monitorear el Despliegue

1. **Ver Logs de Build**
   - Ve a la pestaña "Deployments"
   - Clic en el deployment activo
   - Revisa los logs en tiempo real

2. **Proceso de Build Esperado**:
   ```
   ✅ Installing dependencies...
   ✅ Building frontend...
   ✅ Preparing server...
   ✅ Starting application...
   🚀 Deployment successful!
   ```

### Paso 5: Obtener URL de Producción

1. **Generar Dominio**
   - Ve a la pestaña "Settings"
   - Sección "Domains"
   - Clic en "Generate Domain"

2. **URL Final**
   - Recibirás algo como: `https://tu-proyecto-production.up.railway.app`

## 🔧 Configuración Post-Despliegue

### Variables de Entorno (Opcional)

Si necesitas configurar variables específicas:

1. **Acceder a Variables**
   - Pestaña "Variables"
   - Clic en "New Variable"

2. **Variables Recomendadas**:
   ```
   NODE_ENV=production
   PORT=$PORT (Railway lo maneja automáticamente)
   ```

### Configurar Dominio Personalizado (Opcional)

1. **Dominio Propio**
   - Ve a "Settings" → "Domains"
   - Clic en "Custom Domain"
   - Ingresa tu dominio
   - Configura DNS según instrucciones

## 🧪 Verificación del Despliegue

### Checklist de Funcionalidad

- [ ] **Página Principal**: `https://tu-app.railway.app/`
- [ ] **Menú Cliente**: `https://tu-app.railway.app/menu/1`
- [ ] **Panel Cocina**: `https://tu-app.railway.app/kitchen`
- [ ] **Panel Admin**: `https://tu-app.railway.app/admin`
- [ ] **WebSockets**: Conexión en tiempo real funciona
- [ ] **Sonidos**: Notificaciones de audio
- [ ] **QR Codes**: Generación y descarga
- [ ] **Responsive**: Funciona en móviles

### Pruebas Recomendadas

1. **Flujo Completo de Pedido**:
   - Acceder al menú desde móvil
   - Agregar productos al carrito
   - Realizar pedido
   - Ver actualización en panel de cocina
   - Cambiar estado del pedido

2. **Panel de Administración**:
   - Generar códigos QR
   - Ver analytics
   - Gestionar menú

## 🐛 Solución de Problemas

### Error: "Application failed to respond"

**Causa**: El servidor no está iniciando correctamente

**Solución**:
1. Verificar logs de deployment
2. Confirmar que `start:prod` script existe
3. Revisar dependencias en package.json

```bash
# Comando de debug local
npm run start:prod
```

### Error: "Build failed"

**Causa**: Error en el proceso de build

**Solución**:
1. Verificar que `npm run build` funciona localmente
2. Revisar dependencias de desarrollo
3. Confirmar estructura de archivos

### WebSockets No Conectan

**Causa**: Configuración de Socket.IO para producción

**Solución**: Actualizar SocketContext.tsx
```typescript
const newSocket = io(window.location.origin);
```

### Sonidos No Reproducen

**Causa**: Archivos de audio no se copian al build

**Solución**: Verificar que `/public/sounds/` existe y tiene archivos

## 📊 Monitoreo en Producción

### Métricas de Railway

Railway proporciona automáticamente:
- **CPU Usage**: Uso del procesador
- **Memory Usage**: Uso de memoria
- **Network**: Tráfico de red
- **Response Time**: Tiempo de respuesta

### Logs de Aplicación

```bash
# Ver logs en tiempo real desde Railway dashboard
# O configurar logging estructurado en el código
console.log('🚀 Server running on port:', PORT);
console.log('📱 New order received:', orderData);
```

## 🔄 Actualizaciones y Redepliegue

### Despliegue Automático

Railway redespliega automáticamente cuando:
- Haces push a la rama principal
- Cambias variables de entorno
- Modificas configuración

### Despliegue Manual

1. **Desde Dashboard**:
   - Ve a "Deployments"
   - Clic en "Deploy Latest"

2. **Desde Git**:
   ```bash
   git add .
   git commit -m "Update: descripción del cambio"
   git push origin main
   ```

## 💰 Costos y Límites

### Plan Gratuito de Railway

- **$5 USD gratis** por mes
- **500 horas de ejecución**
- **1GB RAM**
- **1GB almacenamiento**

### Optimización de Costos

1. **Configurar Sleep Mode**:
   - La app se "duerme" después de inactividad
   - Se despierta automáticamente con tráfico

2. **Monitorear Uso**:
   - Dashboard muestra consumo actual
   - Alertas cuando te acercas al límite

## 🎯 Mejores Prácticas

### Seguridad

- [ ] Configurar CORS para tu dominio específico
- [ ] Implementar rate limiting
- [ ] Usar HTTPS (Railway lo proporciona automáticamente)

### Performance

- [ ] Optimizar imágenes del menú
- [ ] Implementar caché para datos estáticos
- [ ] Minimizar payloads de WebSocket

### Mantenimiento

- [ ] Configurar alertas de uptime
- [ ] Implementar health checks
- [ ] Backup regular de datos (si usas persistencia)

## 🆘 Soporte y Recursos

### Documentación Oficial
- [Railway Docs](https://docs.railway.app/)
- [Nixpacks Guide](https://nixpacks.com/)

### Comunidad
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

### Contacto del Proyecto
- Crear issue en tu repositorio para bugs específicos
- Revisar logs de Railway para errores de infraestructura

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] ✅ Código subido a GitHub
- [ ] ✅ Proyecto creado en Railway
- [ ] ✅ Build exitoso
- [ ] ✅ Aplicación accesible via URL
- [ ] ✅ Todas las rutas funcionan
- [ ] ✅ WebSockets conectan correctamente
- [ ] ✅ Funcionalidad completa verificada
- [ ] ✅ Responsive en móviles
- [ ] ✅ Sonidos y notificaciones activas

---

## 🎉 ¡Felicitaciones!

Tu sistema de pedidos para restaurantes está ahora en producción y listo para recibir clientes reales. 

**URL de tu aplicación**: `https://tu-proyecto-production.up.railway.app`

¡Comparte el enlace y los códigos QR con tus clientes!