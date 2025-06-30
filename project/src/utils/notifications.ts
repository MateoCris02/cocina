import { soundManager } from './sounds';

export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.requestPermission();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  public showNotification(title: string, options: NotificationOptions = {}) {
    if (this.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
  }

  public notifyNewOrder(orderNumber: string, tableNumber: number) {
    soundManager.play('newOrder');
    
    this.showNotification('🔔 Nuevo Pedido', {
      body: `Mesa ${tableNumber} - Pedido #${orderNumber}`,
      tag: 'new-order',
      requireInteraction: true
    });
  }

  public notifyOrderReady(orderNumber: string, tableNumber: number) {
    soundManager.play('orderReady');
    
    this.showNotification('✅ Pedido Listo', {
      body: `Mesa ${tableNumber} - Pedido #${orderNumber} está listo`,
      tag: 'order-ready',
      requireInteraction: true
    });
  }

  public notifyOrderStatusChange(status: string, orderNumber: string) {
    soundManager.play('notification');
    
    const statusMessages = {
      preparing: 'Preparando tu pedido',
      ready: 'Tu pedido está listo',
      delivered: 'Pedido entregado'
    };

    this.showNotification('📱 Estado del Pedido', {
      body: `${statusMessages[status as keyof typeof statusMessages]} - #${orderNumber}`,
      tag: 'status-update'
    });
  }
}

export const notificationManager = NotificationManager.getInstance();