import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  item, 
  quantity, 
  onAdd, 
  onRemove 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
          <span className="text-orange-600 font-bold text-lg">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
        
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.allergens.map((allergen, index) => (
              <span 
                key={index}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onRemove}
              disabled={quantity === 0}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-semibold text-lg min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {!item.available && (
            <span className="text-red-500 text-sm font-medium">No disponible</span>
          )}
        </div>
      </div>
    </div>
  );
};