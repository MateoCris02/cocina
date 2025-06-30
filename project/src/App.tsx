import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { MenuPage } from './components/MenuPage';
import { KitchenDisplay } from './components/KitchenDisplay';
import { AdminPanel } from './components/AdminPanel';
import { OrderTracking } from './components/OrderTracking';
import { Home, Utensils, Settings, ChefHat, BarChart3, Clock, Users, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Utensils className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            Sistema de Pedidos Profesional
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa de gestión para restaurantes con códigos QR, análisis en tiempo real, 
            y experiencia de usuario premium. Optimiza tu servicio y aumenta tus ventas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <a
            href="/menu/1"
            className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Home className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Vista Cliente</h3>
            <p className="text-gray-600 leading-relaxed">
              Experimenta la interfaz que verán tus clientes al escanear el código QR. 
              Diseño responsivo y optimizado para móviles.
            </p>
          </a>

          <a
            href="/kitchen"
            className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ChefHat className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Panel de Cocina</h3>
            <p className="text-gray-600 leading-relaxed">
              Gestiona pedidos en tiempo real con notificaciones sonoras, 
              estados visuales y organización inteligente por prioridad.
            </p>
          </a>

          <a
            href="/admin"
            className="group bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Settings className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Administración</h3>
            <p className="text-gray-600 leading-relaxed">
              Panel completo con analytics, gestión de menú, códigos QR, 
              configuración y reportes detallados de ventas.
            </p>
          </a>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-6xl mx-auto mb-16 border border-orange-100">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-12">
            Características Profesionales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Analytics Avanzados</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Reportes detallados de ventas, productos populares, horarios pico y métricas de rendimiento
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Tiempo Real</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comunicación instantánea entre cliente y cocina con notificaciones push y sonoras
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Sin Registro</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Los clientes pueden hacer pedidos sin crear cuentas, proceso simplificado y rápido
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Diseño Premium</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Interfaz moderna y elegante optimizada para todos los dispositivos y tamaños de pantalla
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Personalizable</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configura colores, menú, horarios y toda la información de tu restaurante
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">Gestión Inteligente</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Organización automática de pedidos por prioridad y tiempo de espera
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">¿Listo para revolucionar tu restaurante?</h2>
            <p className="text-xl mb-8 text-orange-100">
              Comienza a usar nuestro sistema profesional hoy mismo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Configurar Restaurante
              </a>
              <a
                href="/menu/1"
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors border-2 border-orange-400"
              >
                Ver Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu/:tableNumber" element={<MenuPage />} />
          <Route path="/kitchen" element={<KitchenDisplay />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;