export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  ingredients?: string[];
  allergens?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  timestamp: Date;
  customerNotes?: string;
}

export interface Table {
  id: string;
  number: number;
  qrCode: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface RestaurantConfig {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  language: 'es' | 'en';
}