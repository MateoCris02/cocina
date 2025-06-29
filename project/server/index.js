import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const db = new sqlite3.Database(':memory:');

// Initialize database tables
db.serialize(() => {
  // Orders table
  db.run(`
    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      table_number INTEGER NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      customer_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Menu items table
  db.run(`
    CREATE TABLE menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      available BOOLEAN DEFAULT 1,
      ingredients TEXT,
      allergens TEXT
    )
  `);

  // Tables configuration
  db.run(`
    CREATE TABLE restaurant_tables (
      id TEXT PRIMARY KEY,
      number INTEGER UNIQUE NOT NULL,
      qr_code TEXT,
      status TEXT DEFAULT 'available'
    )
  `);

  // Restaurant configuration
  db.run(`
    CREATE TABLE restaurant_config (
      id INTEGER PRIMARY KEY,
      name TEXT DEFAULT 'Bella Vista',
      logo TEXT,
      primary_color TEXT DEFAULT '#f97316',
      secondary_color TEXT DEFAULT '#fed7aa',
      currency TEXT DEFAULT 'USD',
      language TEXT DEFAULT 'es'
    )
  `);

  // Insert default configuration
  db.run(`
    INSERT INTO restaurant_config (name, primary_color, currency, language) 
    VALUES ('Bella Vista', '#f97316', 'USD', 'es')
  `);

  // Insert sample menu items
  const sampleItems = [
    {
      id: uuidv4(),
      name: 'Hamburguesa Clásica',
      description: 'Carne de res, lechuga, tomate, cebolla, queso cheddar y salsa especial',
      price: 12.99,
      category: 'Hamburguesas',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: 1,
      allergens: JSON.stringify(['Gluten', 'Lácteos'])
    },
    {
      id: uuidv4(),
      name: 'Pizza Margherita',
      description: 'Masa artesanal, salsa de tomate, mozzarella fresca y albahaca',
      price: 14.50,
      category: 'Pizzas',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: 1,
      allergens: JSON.stringify(['Gluten', 'Lácteos'])
    }
  ];

  sampleItems.forEach(item => {
    db.run(`
      INSERT INTO menu_items (id, name, description, price, category, image, available, allergens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [item.id, item.name, item.description, item.price, item.category, item.image, item.available, item.allergens]);
  });
});

// Store active orders in memory for real-time updates
let activeOrders = [];

// API Routes
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menu_items WHERE available = 1', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const items = rows.map(row => ({
      ...row,
      available: Boolean(row.available),
      allergens: row.allergens ? JSON.parse(row.allergens) : []
    }));
    
    res.json(items);
  });
});

app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const orders = rows.map(row => ({
      ...row,
      items: JSON.parse(row.items),
      timestamp: new Date(row.created_at)
    }));
    
    res.json(orders);
  });
});

app.get('/api/config', (req, res) => {
  db.get('SELECT * FROM restaurant_config WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Send current orders to newly connected clients
  socket.emit('ordersHistory', activeOrders);

  // Handle new order placement
  socket.on('placeOrder', (orderData) => {
    const order = {
      id: uuidv4(),
      ...orderData,
      timestamp: new Date(),
      status: 'pending'
    };

    // Save to database
    db.run(`
      INSERT INTO orders (id, table_number, items, total, status, customer_notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      order.id,
      order.tableNumber,
      JSON.stringify(order.items),
      order.total,
      order.status,
      order.customerNotes || null
    ], (err) => {
      if (err) {
        console.error('Error saving order:', err);
        socket.emit('orderError', { message: 'Error al guardar el pedido' });
        return;
      }

      // Add to active orders
      activeOrders.unshift(order);

      // Broadcast new order to all connected clients
      io.emit('newOrder', order);
      
      console.log('Nuevo pedido recibido:', {
        id: order.id,
        mesa: order.tableNumber,
        total: order.total,
        items: order.items.length
      });
    });
  });

  // Handle order status updates
  socket.on('updateOrderStatus', ({ orderId, status }) => {
    // Update in database
    db.run(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId],
      (err) => {
        if (err) {
          console.error('Error updating order status:', err);
          return;
        }

        // Update in active orders
        const orderIndex = activeOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          activeOrders[orderIndex].status = status;
          
          // Remove from active orders if delivered
          if (status === 'delivered') {
            activeOrders.splice(orderIndex, 1);
          }
        }

        // Broadcast status update to all clients
        io.emit('orderStatusUpdate', { orderId, status });
        
        console.log(`Estado del pedido ${orderId} actualizado a: ${status}`);
      }
    );
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔌 Socket.IO listo para conexiones`);
  console.log(`📊 Panel de cocina: http://localhost:5173/kitchen`);
  console.log(`⚙️  Panel admin: http://localhost:5173/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error cerrando base de datos:', err);
    } else {
      console.log('✅ Base de datos cerrada correctamente');
    }
  });
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});