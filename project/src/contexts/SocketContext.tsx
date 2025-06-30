import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order } from '../types';
import { soundManager } from '../utils/sounds';
import { notificationManager } from '../utils/notifications';

interface SocketContextType {
  socket: null;
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
  const [connected, setConnected] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  // Get API base URL based on environment
  const getApiUrl = (endpoint: string) => {
    if (typeof window !== 'undefined') {
      // Client side - use current origin
      return `${window.location.origin}/api${endpoint}`;
    }
    return `/api${endpoint}`;
  };

  // Load orders from API on mount
  useEffect(() => {
    loadOrders();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(getApiUrl('/orders'));
      if (response.ok) {
        const ordersData = await response.json();
        // Convert timestamp strings to Date objects
        const processedOrders = ordersData.map((order: any) => ({
          ...order,
          timestamp: new Date(order.timestamp)
        }));
        setOrders(processedOrders);
        setConnected(true);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setConnected(false);
      // Retry connection after 5 seconds
      setTimeout(() => setConnected(true), 5000);
    }
  };

  const sendOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>) => {
    try {
      const response = await fetch(getApiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const newOrder = await response.json();
        // Convert timestamp to Date object
        const processedOrder = {
          ...newOrder,
          timestamp: new Date(newOrder.timestamp)
        };
        
        setOrders(prev => [processedOrder, ...prev]);
        soundManager.play('success');
        
        // Notify about new order
        notificationManager.notifyNewOrder(newOrder.id.slice(-6), newOrder.tableNumber);
      } else {
        throw new Error('Failed to send order');
      }
    } catch (error) {
      console.error('Error sending order:', error);
      soundManager.play('notification');
      setConnected(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(getApiUrl('/orders'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status } : order
          ).filter(order => order.status !== 'delivered')
        );

        // Notify about status change
        if (status === 'ready') {
          const order = orders.find(o => o.id === orderId);
          if (order) {
            notificationManager.notifyOrderReady(orderId.slice(-6), order.tableNumber);
          }
        } else {
          notificationManager.notifyOrderStatusChange(status, orderId.slice(-6));
        }
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setConnected(false);
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket: null, 
      connected, 
      orders,
      sendOrder,
      updateOrderStatus
    }}>
      {children}
    </SocketContext.Provider>
  );
};