# 🍽️ Sistema de Pedidos para Restaurantes

Un sistema completo de pedidos para restaurantes con códigos QR, panel de cocina en tiempo real, y administración avanzada. Desarrollado con React, Node.js, Socket.IO y SQLite.

## 🌟 Características Principales

### Para Clientes
- **Menú Digital**: Interfaz moderna y responsive para móviles
- **Pedidos sin Registro**: Los clientes pueden ordenar sin crear cuentas
- **Códigos QR**: Acceso directo al menú escaneando el código de la mesa
- **Seguimiento en Tiempo Real**: Los clientes pueden ver el estado de su pedido
- **Notas Especiales**: Posibilidad de agregar comentarios a los pedidos

### Para la Cocina
- **Panel en Tiempo Real**: Visualización instantánea de nuevos pedidos
- **Notificaciones Sonoras**: Alertas automáticas para nuevos pedidos
- **Gestión de Estados**: Seguimiento del progreso de cada pedido
- **Organización Inteligente**: Pedidos organizados por prioridad y tiempo
- **Interfaz Optimizada**: Diseño pensado para el ambiente de cocina

### Para Administradores
- **Analytics Avanzados**: Reportes de ventas, productos populares, horarios pico
- **Gestión de Menú**: CRUD completo para productos del menú
- **Códigos QR**: Generación y descarga de códigos QR para mesas
- **Configuración**: Personalización de colores, información del restaurante
- **Gestión de Mesas**: Administración completa del layout del restaurante

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Socket.IO Client** para comunicación en tiempo real
- **React Router** para navegación
- **Lucide React** para iconos
- **Date-fns** para manejo de fechas
- **QRCode** para generación de códigos QR

### Backend
- **Node.js** con Express
- **Socket.IO** para WebSockets
- **SQLite** como base de datos
- **CORS** para manejo de políticas de origen cruzado
- **UUID** para generación de IDs únicos

### Herramientas de Desarrollo
- **Vite** como bundler y servidor de desarrollo
- **TypeScript** para tipado estático
- **ESLint** para linting
- **Concurrently** para ejecutar múltiples procesos

## 📋 Requisitos del Sistema

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- Navegador moderno con soporte para WebSockets

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd restaurant-ordering-system
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno (Opcional)
Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=3001
NODE_ENV=production
```

### 4. Ejecutar en Desarrollo
```bash
# Ejecutar cliente y servidor simultáneamente
npm run dev

# O ejecutar por separado
npm run dev:client  # Frontend en puerto 5173
npm run dev:server  # Backend en puerto 3001
```

### 5. Construir para Producción
```bash
npm run build
npm run start:prod
```

## 🌐 Despliegue en Railway

### Configuración Automática
El proyecto está preconfigurado para Railway con los siguientes archivos:

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

### Pasos para Desplegar

1. **Crear cuenta en Railway**: Ve a [railway.app](https://railway.app)

2. **Conectar repositorio**: 
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway y selecciona tu repositorio

3. **Configurar variables de entorno** (si es necesario):
   - Ve a la pestaña "Variables"
   - Agrega `NODE_ENV=production`
   - Railway detectará automáticamente el puerto

4. **Desplegar**:
   - Railway iniciará el build automáticamente
   - El proceso tomará unos minutos
   - Recibirás una URL pública una vez completado

### URLs del Proyecto Desplegado
Una vez desplegado, tendrás acceso a:
- **Página Principal**: `https://tu-app.railway.app/`
- **Menú Cliente**: `https://tu-app.railway.app/menu/1`
- **Panel Cocina**: `https://tu-app.railway.app/kitchen`
- **Panel Admin**: `https://tu-app.railway.app/admin`

## 📱 Uso del Sistema

### Para Clientes
1. **Escanear QR**: Los clientes escanean el código QR de su mesa
2. **Navegar Menú**: Exploran las categorías y productos disponibles
3. **Agregar al Carrito**: Seleccionan productos y cantidades
4. **Hacer Pedido**: Confirman el pedido con notas opcionales
5. **Seguimiento**: Pueden ver el estado en tiempo real

### Para Personal de Cocina
1. **Acceder al Panel**: Ir a `/kitchen`
2. **Ver Pedidos**: Los nuevos pedidos aparecen automáticamente
3. **Actualizar Estados**: 
   - "Nuevo" → "Preparando" → "Listo" → "Entregado"
4. **Notificaciones**: Sonidos automáticos para nuevos pedidos

### Para Administradores
1. **Acceder al Panel**: Ir a `/admin`
2. **Analytics**: Ver reportes de ventas y estadísticas
3. **Gestionar Menú**: Agregar, editar o eliminar productos
4. **Códigos QR**: Generar y descargar códigos para mesas
5. **Configuración**: Personalizar información del restaurante

## 🗂️ Estructura del Proyecto

```
restaurant-ordering-system/
├── public/                     # Archivos estáticos
│   ├── sounds/                # Archivos de audio
│   └── favicon.ico
├── server/                    # Backend Node.js
│   └── index.js              # Servidor principal
├── src/                      # Frontend React
│   ├── components/           # Componentes React
│   │   ├── AdminPanel.tsx
│   │   ├── Analytics.tsx
│   │   ├── CartSummary.tsx
│   │   ├── KitchenDisplay.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── MenuPage.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── ProductCard.tsx
│   │   └── TableManagement.tsx
│   ├── contexts/             # Contextos React
│   │   └── SocketContext.tsx
│   ├── types/               # Definiciones TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilidades
│   │   ├── alerts.ts
│   │   ├── notifications.ts
│   │   └── sounds.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json             # Dependencias y scripts
├── railway.json             # Configuración Railway
├── nixpacks.toml           # Configuración Nixpacks
└── README.md               # Documentación
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Ejecutar cliente y servidor
npm run dev:client       # Solo frontend (puerto 5173)
npm run dev:server       # Solo backend (puerto 3001)

# Producción
npm run build           # Construir frontend
npm run build:server    # Preparar servidor
npm run start          # Ejecutar servidor
npm run start:prod     # Construir y ejecutar

# Calidad de código
npm run lint           # Ejecutar ESLint
npm run preview        # Vista previa del build
```

## 🎨 Personalización

### Colores y Tema
Modifica los colores en `tailwind.config.js` o desde el panel de administración:
- Color primario: `#f97316` (naranja)
- Color secundario: `#fed7aa` (naranja claro)

### Sonidos
Los archivos de audio están en `/public/sounds/`:
- `kitchen-bell.mp3`: Nuevos pedidos
- `order-ready.mp3`: Pedido listo
- `success-chime.mp3`: Acciones exitosas
- `gentle-notification.mp3`: Notificaciones generales

### Base de Datos
El sistema usa SQLite en memoria por defecto. Para persistencia:
1. Cambiar `:memory:` por una ruta de archivo en `server/index.js`
2. Ejemplo: `new sqlite3.Database('./restaurant.db')`

## 🔒 Seguridad

### Medidas Implementadas
- **CORS configurado** para orígenes específicos
- **Validación de datos** en el servidor
- **Sanitización de inputs** para prevenir XSS
- **Rate limiting** implícito por WebSocket connections

### Recomendaciones para Producción
- Implementar autenticación para panel de administración
- Usar HTTPS en producción
- Configurar firewall para base de datos
- Implementar logging y monitoreo

## 📊 Monitoreo y Analytics

### Métricas Disponibles
- **Pedidos totales** por período
- **Ingresos** diarios/semanales/mensuales
- **Productos más vendidos**
- **Horarios pico** de actividad
- **Tiempo promedio** de preparación
- **Ticket promedio** por mesa

### Exportación de Datos
Los datos se pueden exportar desde el panel de administración en formato JSON.

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión WebSocket
```bash
# Verificar que el servidor esté ejecutándose
npm run dev:server

# Verificar puerto en SocketContext.tsx
const newSocket = io('http://localhost:3001');
```

#### 2. Sonidos No Reproducen
- Verificar que los archivos estén en `/public/sounds/`
- Algunos navegadores requieren interacción del usuario primero
- Verificar permisos de audio en el navegador

#### 3. QR Codes No Generan
```bash
# Verificar instalación de qrcode
npm install qrcode @types/qrcode
```

#### 4. Error de Build en Railway
- Verificar que `railway.json` esté en la raíz
- Confirmar que todas las dependencias estén en `package.json`
- Revisar logs de build en Railway dashboard

### Logs y Debugging

#### Desarrollo
```bash
# Ver logs del servidor
npm run dev:server

# Ver logs del cliente
npm run dev:client
```

#### Producción (Railway)
- Acceder a logs desde Railway dashboard
- Usar `console.log` para debugging temporal
- Implementar logging estructurado para producción

## 🤝 Contribución

### Guías de Desarrollo
1. **Fork** el repositorio
2. **Crear rama** para nueva funcionalidad
3. **Seguir convenciones** de código existentes
4. **Escribir tests** para nuevas funcionalidades
5. **Crear Pull Request** con descripción detallada

### Convenciones de Código
- **TypeScript** para tipado estático
- **ESLint** para consistencia de código
- **Componentes funcionales** con hooks
- **Tailwind CSS** para estilos
- **Comentarios** en español para documentación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

### Contacto
- **Email**: soporte@bellavista.com
- **GitHub Issues**: Para reportar bugs
- **Documentación**: Este README y comentarios en código

### FAQ

**P: ¿Puedo usar este sistema para múltiples restaurantes?**
R: Sí, pero necesitarás modificar la base de datos para soporte multi-tenant.

**P: ¿Funciona offline?**
R: No, requiere conexión a internet para sincronización en tiempo real.

**P: ¿Puedo integrar con sistemas de pago?**
R: Sí, puedes integrar Stripe, PayPal u otros procesadores de pago.

**P: ¿Es escalable?**
R: Para alta concurrencia, considera migrar a PostgreSQL y Redis.

---

## 🚀 ¡Listo para Desplegar!

Este proyecto está completamente configurado para Railway. Solo necesitas:

1. **Subir a GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar con Railway** y desplegar automáticamente

3. **¡Tu restaurante digital estará en línea!**

---

*Desarrollado con ❤️ para revolucionar la experiencia gastronómica*