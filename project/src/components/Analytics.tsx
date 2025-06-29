import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Star, Calendar, Filter } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { Order } from '../types';
import { format, startOfDay, endOfDay, subDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  averagePreparationTime: number;
  popularItems: Array<{ name: string; count: number; revenue: number }>;
  hourlyDistribution: Array<{ hour: number; orders: number }>;
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
}

export const Analytics: React.FC = () => {
  const { orders } = useSocket();
  const [dateRange, setDateRange] = useState(7); // días
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    calculateAnalytics();
  }, [orders, dateRange]);

  const calculateAnalytics = () => {
    const now = new Date();
    const startDate = startOfDay(subDays(now, dateRange));
    const endDate = endOfDay(now);

    const filteredOrders = orders.filter(order => 
      isWithinInterval(new Date(order.timestamp), { start: startDate, end: endDate })
    );

    const completedOrders = filteredOrders.filter(order => order.status === 'delivered');

    // Métricas básicas
    const totalOrders = completedOrders.length;
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Tiempo promedio de preparación (simulado)
    const averagePreparationTime = 18; // minutos

    // Items populares
    const itemCounts = new Map<string, { count: number; revenue: number }>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
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

    // Distribución por horas
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: completedOrders.filter(order => 
        new Date(order.timestamp).getHours() === hour
      ).length
    }));

    // Ingresos diarios
    const dailyRevenue = Array.from({ length: dateRange }, (_, i) => {
      const date = subDays(now, dateRange - 1 - i);
      const dayOrders = completedOrders.filter(order =>
        isWithinInterval(new Date(order.timestamp), {
          start: startOfDay(date),
          end: endOfDay(date)
        })
      );
      
      return {
        date: format(date, 'dd/MM', { locale: es }),
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length
      };
    });

    setAnalytics({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      averagePreparationTime,
      popularItems,
      hourlyDistribution,
      dailyRevenue
    });
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Análisis de rendimiento del restaurante</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={1}>Último día</option>
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Pedidos</p>
              <p className="text-3xl font-bold">{analytics.totalOrders}</p>
              <p className="text-blue-100 text-xs mt-1">Últimos {dateRange} días</p>
            </div>
            <BarChart3 size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
              <p className="text-green-100 text-xs mt-1">Últimos {dateRange} días</p>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Ticket Promedio</p>
              <p className="text-3xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
              <p className="text-purple-100 text-xs mt-1">Por pedido</p>
            </div>
            <TrendingUp size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Tiempo Promedio</p>
              <p className="text-3xl font-bold">{analytics.averagePreparationTime}min</p>
              <p className="text-orange-100 text-xs mt-1">Preparación</p>
            </div>
            <Clock size={32} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="mr-2 text-orange-500" size={20} />
            Ingresos Diarios
          </h3>
          
          <div className="space-y-4">
            {analytics.dailyRevenue.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(5, (day.revenue / Math.max(...analytics.dailyRevenue.map(d => d.revenue))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${day.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{day.orders} pedidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="mr-2 text-orange-500" size={20} />
            Productos Más Vendidos
          </h3>
          
          <div className="space-y-4">
            {analytics.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.count} vendidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${item.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="mr-2 text-orange-500" size={20} />
          Distribución de Pedidos por Hora
        </h3>
        
        <div className="grid grid-cols-12 gap-2">
          {analytics.hourlyDistribution.map((hour) => (
            <div key={hour.hour} className="text-center">
              <div className="mb-2">
                <div 
                  className="bg-gradient-to-t from-orange-500 to-red-500 rounded-t mx-auto transition-all duration-500"
                  style={{ 
                    height: `${Math.max(4, (hour.orders / Math.max(...analytics.hourlyDistribution.map(h => h.orders))) * 100)}px`,
                    width: '20px'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{hour.hour}h</p>
              <p className="text-xs font-semibold text-gray-900">{hour.orders}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};