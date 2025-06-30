import React, { useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, User, Volume2, VolumeX, Bell } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { Order } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { soundManager } from '../utils/sounds';
import { notificationManager } from '../utils/notifications';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, connected } = useSocket();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [lastOrderCount, setLastOrderCount] = React.useState(0);

  // Detectar nuevos pedidos y reproducir sonido
  useEffect(() => {
    const currentOrderCount = orders.filter(order => order.status === 'pending').length;
    
    if (currentOrderCount > lastOrderCount && lastOrderCount > 0) {
      const newOrder = orders.find(order => order.status === 'pending');
      if (newOrder) {
        notificationManager.notifyNewOrder(newOrder.id.slice(-6), newOrder.tableNumber);
      }
    }
    
    setLastOrderCount(currentOrderCount);
  }, [orders, lastOrderCount]);

  // Configurar sonidos
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Nuevo';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    
    // Reproducir sonido según el estado
    if (newStatus === 'preparing') {
      soundManager.play('notification');
    } else if (newStatus === 'ready') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        notificationManager.notifyOrderReady(orderId.slice(-6), order.tableNumber);
      }
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'delivered');
  const pendingOrders = activeOrders.filter(order => order.status === 'pending');
  const preparingOrders = activeOrders.filter(order => order.status === 'preparing');
  const readyOrders = activeOrders.filter(order => order.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-2xl border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <AlertCircle size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Panel de Cocina
                </h1>
                <p className="text-gray-300">Bella Vista Restaurant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  soundEnabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
                title={soundEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              
              <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                connected 
                  ? 'bg-green-600 shadow-lg shadow-green-600/30' 
                  : 'bg-red-600 shadow-lg shadow-red-600/30'
              }`}>
                {connected ? '🟢 Conectado' : '🔴 Desconectado'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Nuevos</p>
                <p className="text-3xl font-bold">{pendingOrders.length}</p>
                {pendingOrders.length > 0 && (
                  <div className="flex items-center mt-1">
                    <Bell size={14} className="text-yellow-200 animate-pulse mr-1" />
                    <span className="text-xs text-yellow-200">Requieren atención</span>
                  </div>
                )}
              </div>
              <Clock size={32} className="text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Preparando</p>
                <p className="text-3xl font-bold">{preparingOrders.length}</p>
                {preparingOrders.length > 0 && (
                  <p className="text-xs text-blue-200 mt-1">En proceso</p>
                )}
              </div>
              <AlertCircle size={32} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Listos</p>
                <p className="text-3xl font-bold">{readyOrders.length}</p>
                {readyOrders.length > 0 && (
                  <p className="text-xs text-green-200 mt-1">Para entregar</p>
                )}
              </div>
              <CheckCircle size={32} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Activos</p>
                <p className="text-3xl font-bold">{activeOrders.length}</p>
                <p className="text-xs text-purple-200 mt-1">En el sistema</p>
              </div>
              <User size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {activeOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-3">No hay pedidos activos</h3>
            <p className="text-gray-500 text-lg">Los nuevos pedidos aparecerán aquí automáticamente</p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistema en línea y esperando pedidos</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <div 
                key={order.id} 
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl ${
                  order.status === 'pending' ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50 animate-pulse' : 
                  order.status === 'preparing' ? 'border-blue-500 ring-1 ring-blue-500 ring-opacity-30' :
                  order.status === 'ready' ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' :
                  'border-gray-600'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                          Mesa {order.tableNumber}
                        </span>
                        {order.status === 'pending' && (
                          <span className="animate-bounce text-yellow-400 text-xl">🔔</span>
                        )}
                        {order.status === 'ready' && (
                          <span className="animate-pulse text-green-400 text-xl">✅</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm font-medium">
                        {formatDistanceToNow(new Date(order.timestamp), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        ID: #{order.id.slice(-6)}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-300 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-lg">{item.name}</p>
                          {item.notes && (
                            <div className="mt-2 p-2 bg-yellow-900 bg-opacity-50 rounded border-l-4 border-yellow-500">
                              <p className="text-yellow-300 text-sm font-medium">
                                📝 {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-orange-400 font-bold text-2xl">×{item.quantity}</span>
                          <p className="text-gray-400 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.customerNotes && (
                    <div className="bg-gradient-to-r from-yellow-900 to-orange-900 bg-opacity-50 rounded-lg p-4 mb-6 border border-yellow-600">
                      <p className="text-yellow-300 text-sm font-bold mb-2 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Notas del cliente:
                      </p>
                      <p className="text-yellow-100 text-sm leading-relaxed">{order.customerNotes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-6 p-4 bg-gray-700 rounded-lg">
                    <span className="text-gray-300 font-medium">Total del pedido:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        🚀 Iniciar Preparación
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        ✅ Marcar como Listo
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        📦 Marcar Entregado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};