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

// Configuración de CORS más flexible para producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.railway\.app$/]
    : ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// SQLite Database Setup - usar archivo en producción para persistencia
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'restaurant.db')
  : ':memory:';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// Initialize database tables
db.serialize(() => {
  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      table_number INTEGER NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      customer_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Menu items table
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      available BOOLEAN DEFAULT 1,
      ingredients TEXT,
      allergens TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tables configuration
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurant_tables (
      id TEXT PRIMARY KEY,
      number INTEGER UNIQUE NOT NULL,
      qr_code TEXT,
      status TEXT DEFAULT 'available',
      capacity INTEGER DEFAULT 4,
      location TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Restaurant configuration
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurant_config (
      id INTEGER PRIMARY KEY,
      name TEXT DEFAULT 'Bella Vista',
      logo TEXT,
      primary_color TEXT DEFAULT '#f97316',
      secondary_color TEXT DEFAULT '#fed7aa',
      currency TEXT DEFAULT 'USD',
      language TEXT DEFAULT 'es',
      address TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default configuration if not exists
  db.get('SELECT COUNT(*) as count FROM restaurant_config', (err, row) => {
    if (!err && row.count === 0) {
      db.run(`
        INSERT INTO restaurant_config (name, primary_color, currency, language, address, phone, email) 
        VALUES ('Bella Vista', '#f97316', 'USD', 'es', 'Av. Principal 123, Ciudad', '+1 (555) 123-4567', 'info@bellavista.com')
      `);
    }
  });

  // Insert sample menu items if not exists
  db.get('SELECT COUNT(*) as count FROM menu_items', (err, row) => {
    if (!err && row.count === 0) {
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
        },
        {
          id: uuidv4(),
          name: 'Ensalada César',
          description: 'Lechuga romana, pollo a la parrilla, crutones, parmesano y aderezo César',
          price: 10.99,
          category: 'Ensaladas',
          image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
          available: 1,
          allergens: JSON.stringify(['Lácteos', 'Huevo'])
        },
        {
          id: uuidv4(),
          name: 'Pasta Carbonara',
          description: 'Pasta fresca con panceta, huevo, parmesano y pimienta negra',
          price: 13.75,
          category: 'Pastas',
          image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
          available: 1,
          allergens: JSON.stringify(['Gluten', 'Lácteos', 'Huevo'])
        },
        {
          id: uuidv4(),
          name: 'Tacos de Pollo',
          description: 'Tres tacos con pollo marinado, pico de gallo, aguacate y crema',
          price: 11.25,
          category: 'Mexicana',
          image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
          available: 1,
          allergens: JSON.stringify(['Lácteos'])
        },
        {
          id: uuidv4(),
          name: 'Salmón a la Parrilla',
          description: 'Filete de salmón con vegetales asados y salsa de limón',
          price: 18.99,
          category: 'Pescados',
          image: 'https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=400',
          available: 1,
          allergens: JSON.stringify(['Pescado'])
        }
      ];

      sampleItems.forEach(item => {
        db.run(`
          INSERT INTO menu_items (id, name, description, price, category, image, available, allergens)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [item.id, item.name, item.description, item.price, item.category, item.image, item.available, item.allergens]);
      });

      console.log('✅ Datos de ejemplo insertados en el menú');
    }
  });

  // Insert sample tables if not exists
  db.get('SELECT COUNT(*) as count FROM restaurant_tables', (err, row) => {
    if (!err && row.count === 0) {
      const sampleTables = [
        { id: uuidv4(), number: 1, capacity: 2, location: 'Ventana', status: 'available' },
        { id: uuidv4(), number: 2, capacity: 4, location: 'Centro', status: 'available' },
        { id: uuidv4(), number: 3, capacity: 6, location: 'Terraza', status: 'available' },
        { id: uuidv4(), number: 4, capacity: 2, location: 'Ventana', status: 'available' },
        { id: uuidv4(), number: 5, capacity: 4, location: 'Centro', status: 'available' }
      ];

      sampleTables.forEach(table => {
        db.run(`
          INSERT INTO restaurant_tables (id, number, capacity, location, status)
          VALUES (?, ?, ?, ?, ?)
        `, [table.id, table.number, table.capacity, table.location, table.status]);
      });

      console.log('✅ Mesas de ejemplo creadas');
    }
  });
});

// Store active orders in memory for real-time updates
let activeOrders = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menu_items WHERE available = 1 ORDER BY category, name', (err, rows) => {
    if (err) {
      console.error('Error fetching menu:', err);
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

app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM menu_items WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching menu item:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    
    const item = {
      ...row,
      available: Boolean(row.available),
      allergens: row.allergens ? JSON.parse(row.allergens) : []
    };
    
    res.json(item);
  });
});

app.get('/api/orders', (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM orders';
  let params = [];
  
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err);
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

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    const order = {
      ...row,
      items: JSON.parse(row.items),
      timestamp: new Date(row.created_at)
    };
    
    res.json(order);
  });
});

app.get('/api/config', (req, res) => {
  db.get('SELECT * FROM restaurant_config WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Error fetching config:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

app.put('/api/config', (req, res) => {
  const { name, logo, primary_color, secondary_color, currency, language, address, phone, email } = req.body;
  
  db.run(`
    UPDATE restaurant_config 
    SET name = ?, logo = ?, primary_color = ?, secondary_color = ?, currency = ?, language = ?, address = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `, [name, logo, primary_color, secondary_color, currency, language, address, phone, email], (err) => {
    if (err) {
      console.error('Error updating config:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Configuration updated successfully' });
  });
});

app.get('/api/tables', (req, res) => {
  db.all('SELECT * FROM restaurant_tables ORDER BY number', (err, rows) => {
    if (err) {
      console.error('Error fetching tables:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const { days = 7 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  // Get orders from the specified period
  db.all(
    'SELECT * FROM orders WHERE created_at >= ? ORDER BY created_at DESC',
    [startDate.toISOString()],
    (err, orders) => {
      if (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      const completedOrders = orders.filter(order => order.status === 'delivered');
      const totalOrders = completedOrders.length;
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate popular items
      const itemCounts = new Map();
      completedOrders.forEach(order => {
        const items = JSON.parse(order.items);
        items.forEach(item => {
          const existing = itemCounts.get(item.name) || { count: 0, revenue: 0 };
          itemCounts.set(item.name, {
            count: existing.count + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity)
          });
        });
      });
      
      const popularItems = Array.from(itemCounts.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      res.json({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        popularItems,
        period: `${days} days`
      });
    }
  );
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

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
        console.error('❌ Error saving order:', err);
        socket.emit('orderError', { message: 'Error al guardar el pedido' });
        return;
      }

      // Add to active orders
      activeOrders.unshift(order);

      // Broadcast new order to all connected clients
      io.emit('newOrder', order);
      
      console.log('🆕 Nuevo pedido recibido:', {
        id: order.id.slice(-6),
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
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId],
      (err) => {
        if (err) {
          console.error('❌ Error updating order status:', err);
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
        
        console.log(`🔄 Estado del pedido ${orderId.slice(-6)} actualizado a: ${status}`);
      }
    );
  });

  // Handle joining table-specific rooms
  socket.on('joinTable', (tableNumber) => {
    socket.join(`table-${tableNumber}`);
    console.log(`👥 Cliente ${socket.id} se unió a mesa ${tableNumber}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Servidor ejecutándose en puerto', PORT);
  console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');
  console.log('📱 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:5173');
  console.log('🔌 Socket.IO listo para conexiones');
  console.log('📊 Panel de cocina: /kitchen');
  console.log('⚙️  Panel admin: /admin');
  console.log('🏥 Health check: /health');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Recibida señal ${signal}, cerrando servidor...`);
  
  server.close(() => {
    console.log('✅ Servidor HTTP cerrado');
    
    db.close((err) => {
      if (err) {
        console.error('❌ Error cerrando base de datos:', err);
      } else {
        console.log('✅ Base de datos cerrada correctamente');
      }
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forzando cierre del servidor');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});