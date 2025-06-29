import React, { useState } from 'react';
import { Settings, QrCode, BarChart3, Users, Menu as MenuIcon, Table, TrendingUp } from 'lucide-react';
import { MenuManagement } from './MenuManagement';
import { TableManagement } from './TableManagement';
import { Analytics } from './Analytics';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'tables', label: 'Mesas y QR', icon: QrCode },
    { id: 'menu', label: 'Menú', icon: MenuIcon },
    { id: 'orders', label: 'Pedidos', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-gray-600 mt-1">Bella Vista Restaurant - Sistema Profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-8">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
              <div className="p-8">
                {activeTab === 'analytics' && <Analytics />}
                {activeTab === 'tables' && <TableManagement />}
                {activeTab === 'menu' && <MenuManagement />}
                
                {activeTab === 'orders' && (
                  <div className="text-center py-20">
                    <BarChart3 size={64} className="text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                      Gestión de Pedidos
                    </h3>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                      Aquí podrás ver el historial completo de pedidos, generar reportes y gestionar devoluciones
                    </p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Historial</h4>
                        <p className="text-sm text-blue-700">Ver todos los pedidos realizados</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Reportes</h4>
                        <p className="text-sm text-green-700">Generar reportes detallados</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">Devoluciones</h4>
                        <p className="text-sm text-purple-700">Gestionar reembolsos</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Restaurante</h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Información General */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Información General
                          </h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Restaurante
                            </label>
                            <input
                              type="text"
                              defaultValue="Bella Vista"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dirección
                            </label>
                            <textarea
                              defaultValue="Av. Principal 123, Ciudad"
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              defaultValue="+1 (555) 123-4567"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              defaultValue="info@bellavista.com"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>

                        {/* Configuración Visual */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Configuración Visual
                          </h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color Principal
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                defaultValue="#f97316"
                                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                              />
                              <input
                                type="text"
                                defaultValue="#f97316"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Color Secundario
                            </label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="color"
                                defaultValue="#fed7aa"
                                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                              />
                              <input
                                type="text"
                                defaultValue="#fed7aa"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Moneda
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="MXN">MXN ($)</option>
                              <option value="COP">COP ($)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Idioma
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                              <option value="es">Español</option>
                              <option value="en">English</option>
                              <option value="fr">Français</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Horarios de Operación */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                          Horarios de Operación
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                            <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="w-20">
                                <span className="text-sm font-medium text-gray-700">{day}</span>
                              </div>
                              <div className="flex items-center space-x-2 flex-1">
                                <input
                                  type="time"
                                  defaultValue="09:00"
                                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                  type="time"
                                  defaultValue="22:00"
                                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>
                              <label className="flex items-center">
                                <input type="checkbox" defaultChecked className="mr-2" />
                                <span className="text-sm text-gray-600">Abierto</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-8 border-t border-gray-200">
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-semibold">
                          Guardar Configuración
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};