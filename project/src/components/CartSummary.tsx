import React from 'react';
import { ShoppingCart, X, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';

interface CartSummaryProps {
  items: CartItem[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
  customerNotes: string;
  onNotesChange: (notes: string) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  isOpen,
  onToggle,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  customerNotes,
  onNotesChange
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors relative"
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Tu Pedido</h2>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tu carrito está vacío
            </p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-orange-600">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">Notas especiales</span>
                </div>
                <textarea
                  value={customerNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  placeholder="Ej: Sin cebolla, término medio, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onPlaceOrder}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Enviar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};