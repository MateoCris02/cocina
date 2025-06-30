import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders (in production, use a database)
let orders = [];

// API Routes
app.get('/api/config', (req, res) => {
  const config = {
    id: 1,
    name: 'Bella Vista',
    logo: null,
    primary_color: '#f97316',
    secondary_color: '#fed7aa',
    currency: 'USD',
    language: 'es'
  };
  res.json(config);
});

app.get('/api/menu', (req, res) => {
  const menuItems = [
    {
      id: '1',
      name: 'Hamburguesa Clásica',
      description: 'Carne de res, lechuga, tomate, cebolla, queso cheddar y salsa especial',
      price: 12.99,
      category: 'Hamburguesas',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Gluten', 'Lácteos']
    },
    {
      id: '2',
      name: 'Pizza Margherita',
      description: 'Masa artesanal, salsa de tomate, mozzarella fresca y albahaca',
      price: 14.50,
      category: 'Pizzas',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Gluten', 'Lácteos']
    },
    {
      id: '3',
      name: 'Ensalada César',
      description: 'Lechuga romana, pollo a la parrilla, crutones, parmesano y aderezo César',
      price: 10.99,
      category: 'Ensaladas',
      image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Lácteos', 'Huevo']
    },
    {
      id: '4',
      name: 'Pasta Carbonara',
      description: 'Pasta fresca con panceta, huevo, parmesano y pimienta negra',
      price: 13.75,
      category: 'Pastas',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Gluten', 'Lácteos', 'Huevo']
    },
    {
      id: '5',
      name: 'Tacos de Pollo',
      description: 'Tres tacos con pollo marinado, pico de gallo, aguacate y crema',
      price: 11.25,
      category: 'Mexicana',
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Lácteos']
    },
    {
      id: '6',
      name: 'Salmón a la Parrilla',
      description: 'Filete de salmón con vegetales asados y salsa de limón',
      price: 18.99,
      category: 'Pescados',
      image: 'https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      allergens: ['Pescado']
    }
  ];

  res.json(menuItems);
});

app.get('/api/orders', (req, res) => {
  // Return orders sorted by creation time
  const sortedOrders = orders
    .map(order => ({
      ...order,
      timestamp: new Date(order.timestamp)
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  res.json(sortedOrders);
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  
  const newOrder = {
    id: generateOrderId(),
    ...orderData,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  orders.unshift(newOrder);
  
  console.log('New order received:', {
    id: newOrder.id,
    table: newOrder.tableNumber,
    total: newOrder.total,
    items: newOrder.items.length
  });
  
  res.status(201).json(newOrder);
});

app.put('/api/orders', (req, res) => {
  const { orderId, status } = req.body;
  
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    
    // Remove from active orders if delivered
    if (status === 'delivered') {
      orders.splice(orderIndex, 1);
    }
    
    console.log(`Order ${orderId} status updated to: ${status}`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Generate unique order ID
function generateOrderId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 App: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`📊 Kitchen: http://localhost:${PORT}/kitchen`);
  console.log(`⚙️  Admin: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});