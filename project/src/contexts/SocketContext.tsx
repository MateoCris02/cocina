import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order } from '../types';
import { soundManager } from '../utils/sounds';
import { notificationManager } from '../utils/notifications';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  orders: Order[];
  sendOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('🔌 Conectado al servidor');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Desconectado del servidor');
    });

    newSocket.on('newOrder', (order: Order) => {
      console.log('🆕 Nuevo pedido recibido:', order);
      setOrders(prev => [order, ...prev]);
      
      // Reproducir sonido y mostrar notificación
      soundManager.play('newOrder');
      notificationManager.notifyNewOrder(order.id.slice(-6), order.tableNumber);
    });

    newSocket.on('orderStatusUpdate', ({ orderId, status }: { orderId: string, status: Order['status'] }) => {
      console.log('📱 Estado actualizado:', { orderId: orderId.slice(-6), status });
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );

      // Notificar cambio de estado
      if (status === 'ready') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          notificationManager.notifyOrderReady(orderId.slice(-6), order.tableNumber);
        }
      } else {
        notificationManager.notifyOrderStatusChange(status, orderId.slice(-6));
      }
    });

    newSocket.on('ordersHistory', (orderHistory: Order[]) => {
      console.log('📋 Historial de pedidos cargado:', orderHistory.length);
      setOrders(orderHistory);
    });

    newSocket.on('orderError', (error: { message: string }) => {
      console.error('❌ Error en pedido:', error.message);
      soundManager.play('notification');
    });

    return () => {
      console.log('🔌 Cerrando conexión socket');
      newSocket.close();
    };
  }, []);

  const sendOrder = (orderData: Omit<Order, 'id' | 'timestamp'>) => {
    if (socket && connected) {
      console.log('📤 Enviando pedido:', orderData);
      socket.emit('placeOrder', orderData);
      soundManager.play('success');
    } else {
      console.error('❌ No se puede enviar pedido: socket no conectado');
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (socket && connected) {
      console.log('🔄 Actualizando estado:', { orderId: orderId.slice(-6), status });
      socket.emit('updateOrderStatus', { orderId, status });
    } else {
      console.error('❌ No se puede actualizar estado: socket no conectado');
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      orders,
      sendOrder,
      updateOrderStatus
    }}>
      {children}
    </SocketContext.Provider>
  );
};