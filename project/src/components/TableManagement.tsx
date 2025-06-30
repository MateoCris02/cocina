import React, { useState } from 'react';
import { QrCode, Download, Plus, Edit, Trash2, Eye, Users, MapPin } from 'lucide-react';
import QRCode from 'qrcode';

interface Table {
  id: string;
  number: number;
  qrCode: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  capacity: number;
  location: string;
  notes?: string;
}

export const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, qrCode: '', status: 'available', capacity: 2, location: 'Ventana' },
    { id: '2', number: 2, qrCode: '', status: 'occupied', capacity: 4, location: 'Centro' },
    { id: '3', number: 3, qrCode: '', status: 'available', capacity: 6, location: 'Terraza' },
    { id: '4', number: 4, qrCode: '', status: 'reserved', capacity: 2, location: 'Ventana' },
  ]);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const generateQRCode = async (tableNumber: number) => {
    try {
      const url = `${window.location.origin}/menu/${tableNumber}`;
      const qrCodeUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setTables(prev => 
        prev.map(table => 
          table.number === tableNumber 
            ? { ...table, qrCode: qrCodeUrl }
            : table
        )
      );
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const generateAllQRCodes = async () => {
    for (const table of tables) {
      if (!table.qrCode) {
        await generateQRCode(table.number);
        // Pequeña pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  const downloadQRCode = (table: Table) => {
    const link = document.createElement('a');
    link.download = `mesa-${table.number}-qr.png`;
    link.href = table.qrCode;
    link.click();
  };

  const downloadAllQRCodes = () => {
    tables.forEach(table => {
      if (table.qrCode) {
        setTimeout(() => downloadQRCode(table), 100 * table.number);
      }
    });
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const handleSaveTable = (table: Table) => {
    if (isAddingNew) {
      const newTable = { ...table, id: Date.now().toString() };
      setTables(prev => [...prev, newTable]);
      setIsAddingNew(false);
    } else {
      setTables(prev => prev.map(t => t.id === table.id ? table : t));
    }
    setEditingTable(null);
  };

  const handleDeleteTable = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta mesa?')) {
      setTables(prev => prev.filter(table => table.id !== id));
    }
  };

  const TableForm: React.FC<{ table: Table; onSave: (table: Table) => void; onCancel: () => void }> = ({
    table,
    onSave,
    onCancel
  }) => {
    const [formData, setFormData] = useState(table);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {isAddingNew ? 'Agregar Mesa' : 'Editar Mesa'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Mesa
                </label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Table['status'] }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Mesas</h2>
          <p className="text-gray-600 mt-1">Administra las mesas y códigos QR de tu restaurante</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateAllQRCodes}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <QrCode size={20} />
            <span>Generar Todos los QR</span>
          </button>
          <button
            onClick={downloadAllQRCodes}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Descargar Todos</span>
          </button>
          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingTable({
                id: '',
                number: Math.max(...tables.map(t => t.number)) + 1,
                qrCode: '',
                status: 'available',
                capacity: 4,
                location: ''
              });
            }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Agregar Mesa</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Disponibles</p>
              <p className="text-2xl font-bold text-green-700">
                {tables.filter(t => t.status === 'available').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Eye className="text-white" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Ocupadas</p>
              <p className="text-2xl font-bold text-red-700">
                {tables.filter(t => t.status === 'occupied').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Reservadas</p>
              <p className="text-2xl font-bold text-yellow-700">
                {tables.filter(t => t.status === 'reserved').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Mesas</p>
              <p className="text-2xl font-bold text-blue-700">{tables.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <QrCode className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mesa {table.number}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Users size={14} />
                    <span>{table.capacity} personas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <MapPin size={14} />
                    <span>{table.location}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(table.status)}`}>
                  {getStatusText(table.status)}
                </span>
              </div>

              {table.qrCode ? (
                <div className="text-center mb-4">
                  <img 
                    src={table.qrCode} 
                    alt={`QR Mesa ${table.number}`}
                    className="w-32 h-32 mx-auto mb-3 border border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={() => downloadQRCode(table)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Download size={16} />
                    <span>Descargar</span>
                  </button>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <QrCode size={32} className="text-gray-400" />
                  </div>
                  <button
                    onClick={() => generateQRCode(table.number)}
                    className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Generar QR
                  </button>
                </div>
              )}

              {table.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{table.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingTable(table)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  URL: /menu/{table.number}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Form Modal */}
      {editingTable && (
        <TableForm
          table={editingTable}
          onSave={handleSaveTable}
          onCancel={() => {
            setEditingTable(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
};