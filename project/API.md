# 📡 Documentación de la API

## 🌐 Endpoints REST

### Base URL
```
Desarrollo: http://localhost:3001
Producción: https://tu-app.railway.app
```

### 📋 Menú

#### GET /api/menu
Obtiene todos los productos del menú disponibles.

**Respuesta:**
```json
[
  {
    "id": "1",
    "name": "Hamburguesa Clásica",
    "description": "Carne de res, lechuga, tomate...",
    "price": 12.99,
    "category": "Hamburguesas",
    "image": "https://...",
    "available": true,
    "allergens": ["Gluten", "Lácteos"]
  }
]
```

#### GET /api/menu/:id
Obtiene un producto específico del menú.

**Parámetros:**
- `id` (string): ID del producto

**Respuesta:**
```json
{
  "id": "1",
  "name": "Hamburguesa Clásica",
  "description": "Carne de res, lechuga, tomate...",
  "price": 12.99,
  "category": "Hamburguesas",
  "image": "https://...",
  "available": true,
  "allergens": ["Gluten", "Lácteos"]
}
```

### 📦 Pedidos

#### GET /api/orders
Obtiene todos los pedidos (para administración).

**Respuesta:**
```json
[
  {
    "id": "uuid-123",
    "tableNumber": 5,
    "items": [
      {
        "id": "1",
        "name": "Hamburguesa Clásica",
        "price": 12.99,
        "quantity": 2,
        "notes": "Sin cebolla"
      }
    ],
    "total": 25.98,
    "status": "preparing",
    "timestamp": "2024-01-15T10:30:00Z",
    "customerNotes": "Para llevar"
  }
]
```

#### GET /api/orders/:id
Obtiene un pedido específico.

**Parámetros:**
- `id` (string): ID del pedido

#### POST /api/orders
Crea un nuevo pedido (alternativa a WebSocket).

**Body:**
```json
{
  "tableNumber": 5,
  "items": [
    {
      "id": "1",
      "name": "Hamburguesa Clásica",
      "price": 12.99,
      "quantity": 2,
      "notes": "Sin cebolla"
    }
  ],
  "total": 25.98,
  "customerNotes": "Para llevar"
}
```

### ⚙️ Configuración

#### GET /api/config
Obtiene la configuración del restaurante.

**Respuesta:**
```json
{
  "id": 1,
  "name": "Bella Vista",
  "logo": "https://...",
  "primaryColor": "#f97316",
  "secondaryColor": "#fed7aa",
  "currency": "USD",
  "language": "es"
}
```

#### PUT /api/config
Actualiza la configuración del restaurante.

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "primaryColor": "#ff6b35",
  "currency": "EUR"
}
```

## 🔌 WebSocket Events

### Conexión
```javascript
const socket = io('http://localhost:3001');
```

### 📤 Eventos del Cliente

#### `placeOrder`
Envía un nuevo pedido.

**Payload:**
```javascript
socket.emit('placeOrder', {
  tableNumber: 5,
  items: [
    {
      id: "1",
      name: "Hamburguesa Clásica",
      price: 12.99,
      quantity: 2,
      notes: "Sin cebolla"
    }
  ],
  total: 25.98,
  customerNotes: "Para llevar"
});
```

#### `updateOrderStatus`
Actualiza el estado de un pedido (solo cocina/admin).

**Payload:**
```javascript
socket.emit('updateOrderStatus', {
  orderId: "uuid-123",
  status: "preparing" // pending | preparing | ready | delivered
});
```

#### `joinRoom`
Se une a una sala específica (por mesa).

**Payload:**
```javascript
socket.emit('joinRoom', {
  tableNumber: 5
});
```

### 📥 Eventos del Servidor

#### `newOrder`
Notifica un nuevo pedido (a cocina/admin).

**Payload:**
```javascript
socket.on('newOrder', (order) => {
  console.log('Nuevo pedido:', order);
  // order tiene la estructura completa del pedido
});
```

#### `orderStatusUpdate`
Notifica cambio de estado de pedido.

**Payload:**
```javascript
socket.on('orderStatusUpdate', ({ orderId, status }) => {
  console.log(`Pedido ${orderId} ahora está: ${status}`);
});
```

#### `ordersHistory`
Envía historial de pedidos al conectarse.

**Payload:**
```javascript
socket.on('ordersHistory', (orders) => {
  console.log('Historial cargado:', orders);
});
```

#### `orderError`
Notifica errores en pedidos.

**Payload:**
```javascript
socket.on('orderError', (error) => {
  console.error('Error:', error.message);
});
```

#### `connect`
Confirmación de conexión exitosa.

```javascript
socket.on('connect', () => {
  console.log('Conectado al servidor');
});
```

#### `disconnect`
Notificación de desconexión.

```javascript
socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});
```

## 🔐 Autenticación

### Estado Actual
El sistema actualmente **no requiere autenticación** para:
- Clientes haciendo pedidos
- Visualización del menú
- Seguimiento de pedidos

### Para Implementar (Recomendado para Producción)

#### JWT Authentication
```javascript
// Headers requeridos para endpoints protegidos
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

#### Roles Sugeridos
- **Cliente**: Solo puede hacer pedidos y ver su estado
- **Cocina**: Puede ver y actualizar estados de pedidos
- **Admin**: Acceso completo a configuración y analytics

## 📊 Códigos de Estado HTTP

### Exitosos (2xx)
- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente

### Errores del Cliente (4xx)
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: Autenticación requerida
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Datos válidos pero lógicamente incorrectos

### Errores del Servidor (5xx)
- `500 Internal Server Error`: Error interno del servidor
- `503 Service Unavailable`: Servicio temporalmente no disponible

## 🔄 Rate Limiting

### Límites Actuales
- **Pedidos**: 10 por minuto por IP
- **API General**: 100 requests por minuto por IP
- **WebSocket**: 50 eventos por minuto por conexión

### Headers de Rate Limit
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Ejemplos de Uso

### JavaScript/Fetch
```javascript
// Obtener menú
const response = await fetch('/api/menu');
const menu = await response.json();

// Crear pedido via REST
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tableNumber: 5,
    items: [...],
    total: 25.98
  })
});
```

### Socket.IO Client
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Escuchar nuevos pedidos
socket.on('newOrder', (order) => {
  console.log('Nuevo pedido recibido:', order);
});

// Enviar pedido
socket.emit('placeOrder', orderData);
```

### React Hook
```javascript
import { useSocket } from '../contexts/SocketContext';

function KitchenComponent() {
  const { orders, updateOrderStatus } = useSocket();
  
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };
  
  return (
    <div>
      {orders.map(order => (
        <OrderCard 
          key={order.id} 
          order={order}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
```

## 🔧 Configuración del Cliente

### CORS
```javascript
// server/index.js
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tu-dominio.com"],
    methods: ["GET", "POST"]
  }
});
```

### Reconexión Automática
```javascript
const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 5
});
```

## 📝 Validación de Datos

### Esquemas de Validación

#### Pedido
```javascript
{
  tableNumber: {
    type: "number",
    required: true,
    min: 1,
    max: 100
  },
  items: {
    type: "array",
    required: true,
    minItems: 1,
    items: {
      type: "object",
      properties: {
        id: { type: "string", required: true },
        quantity: { type: "number", required: true, min: 1 }
      }
    }
  },
  total: {
    type: "number",
    required: true,
    min: 0
  }
}
```

#### Producto del Menú
```javascript
{
  name: {
    type: "string",
    required: true,
    maxLength: 100
  },
  price: {
    type: "number",
    required: true,
    min: 0
  },
  category: {
    type: "string",
    required: true
  },
  available: {
    type: "boolean",
    default: true
  }
}
```

## 🚨 Manejo de Errores

### Estructura de Error Estándar
```json
{
  "error": {
    "code": "INVALID_ORDER",
    "message": "El pedido contiene productos no válidos",
    "details": {
      "invalidItems": ["item-id-1", "item-id-2"]
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Códigos de Error Personalizados
- `INVALID_ORDER`: Datos de pedido inválidos
- `ITEM_NOT_AVAILABLE`: Producto no disponible
- `TABLE_NOT_FOUND`: Mesa no existe
- `ORDER_NOT_FOUND`: Pedido no encontrado
- `INVALID_STATUS_TRANSITION`: Cambio de estado inválido

## 📈 Monitoreo y Logs

### Eventos Loggeados
- Nuevos pedidos creados
- Cambios de estado de pedidos
- Errores de validación
- Conexiones/desconexiones WebSocket
- Errores del servidor

### Formato de Log
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "event": "order_created",
  "data": {
    "orderId": "uuid-123",
    "tableNumber": 5,
    "total": 25.98
  }
}
```

---

Esta API está diseñada para ser RESTful, predecible y fácil de integrar con cualquier frontend o sistema externo.