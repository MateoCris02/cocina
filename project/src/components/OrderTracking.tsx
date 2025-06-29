import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle, Utensils, Truck, MapPin, Phone, Star } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { Order } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useSocket();
  const [order, setOrder] = useState<Order | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(20);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      
      // Calcular tiempo estimado basado en el estado
      const elapsed = Date.now() - new Date(foundOrder.timestamp).getTime();
      const elapsedMinutes = Math.floor(elapsed / 60000);
      
      switch (foundOrder.status) {
        case 'pending':
          setEstimatedTime(20 - elapsedMinutes);
          break;
        case 'preparing':
          setEstimatedTime(15 - elapsedMinutes);
          break;
        case 'ready':
          setEstimatedTime(0);
          break;
        default:
          setEstimatedTime(0);
      }
    }
  }, [orderId, orders]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { id: 1, title: 'Pedido Recibido', icon: CheckCircle, description: 'Tu pedido ha sido confirmado' },
    { id: 2, title: 'Preparando', icon: Utensils, description: 'Nuestros chefs están preparando tu comida' },
    { id: 3, title: 'Listo', icon: Clock, description: 'Tu pedido está listo para recoger' },
    { id: 4, title: 'Entregado', icon: Truck, description: 'Pedido entregado exitosamente' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Seguimiento de Pedido
              </h1>
              <p className="text-gray-600 mt-1">Pedido #{order.id.slice(-8)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <MapPin size={16} />
                <span>Mesa {order.tableNumber}</span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>

          {/* Tiempo estimado */}
          {estimatedTime > 0 && order.status !== 'delivered' && (
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="text-orange-600" size={24} />
                <div className="text-center">
                  <p className="text-orange-800 font-semibold">Tiempo estimado restante</p>
                  <p className="text-2xl font-bold text-orange-600">{Math.max(0, estimatedTime)} minutos</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Estado del Pedido</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : isCurrent 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del Pedido</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                    {item.notes && (
                      <p className="text-sm text-orange-600 mt-1">📝 {item.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">×{item.quantity}</p>
                  <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {order.customerNotes && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Notas especiales:</h4>
              <p className="text-yellow-700">{order.customerNotes}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Necesitas ayuda?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Llámanos</h4>
                <p className="text-blue-700">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Califica tu experiencia</h4>
                <p className="text-green-700">Ayúdanos a mejorar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};