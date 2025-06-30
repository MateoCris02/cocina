import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Utensils, Clock, MapPin, Wifi, WifiOff } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CartSummary } from './CartSummary';
import { useSocket } from '../contexts/SocketContext';
import { MenuItem, CartItem } from '../types';
import { soundManager } from '../utils/sounds';

// Mock menu data - in production this would come from the API
const MENU_ITEMS: MenuItem[] = [
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

const CATEGORIES = ['Todas', 'Hamburguesas', 'Pizzas', 'Ensaladas', 'Pastas', 'Mexicana', 'Pescados'];

export const MenuPage: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const { sendOrder, connected } = useSocket();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filteredItems = selectedCategory === 'Todas' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    // Sonido al agregar al carrito
    soundManager.play('notification');
  };

  const removeFromCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== item.id);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    sendOrder({
      tableNumber: parseInt(tableNumber || '1'),
      items: cartItems,
      total,
      status: 'pending',
      customerNotes
    });

    setOrderPlaced(true);
    setOrderSuccess(true);
    setCartItems([]);
    setCustomerNotes('');
    setIsCartOpen(false);

    // Reproducir sonido de éxito
    soundManager.play('success');

    setTimeout(() => {
      setOrderPlaced(false);
      setOrderSuccess(false);
    }, 4000);
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full border border-green-200">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Utensils className="text-white" size={32} />
          </div>
          
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Pedido Enviado!</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Tu pedido ha sido enviado a la cocina. Te notificaremos cuando esté listo.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-3 text-green-700">
              <Clock size={20} />
              <span className="font-semibold">Tiempo estimado: 15-20 minutos</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Mesa {tableNumber}</span>
          </div>

          <button
            onClick={() => {
              setOrderPlaced(false);
              setOrderSuccess(false);
            }}
            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
          >
            Continuar Navegando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Utensils className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Bella Vista
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span className="font-medium">Mesa {tableNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                connected 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span>{connected ? 'Conectado' : 'Sin conexión'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item)}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <CartSummary
        items={cartItems}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onPlaceOrder={placeOrder}
        customerNotes={customerNotes}
        onNotesChange={setCustomerNotes}
      />
    </div>
  );
};