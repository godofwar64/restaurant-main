import React, { createContext, useContext, useState, useCallback } from 'react';
import { MenuItem } from '@/services';
import { CartItem } from '@/components/CartSidebar';

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: MenuItem, quantity: number, selectedSize?: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeItem: (id: string, size: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((dish: MenuItem, quantity: number, selectedSize?: string) => {
    const size = selectedSize || 'default';
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === dish.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        let price = dish.price || 0;
        if (dish.prices && selectedSize && dish.prices[selectedSize]) {
          price = dish.prices[selectedSize];
        }
        
        const newItem: CartItem = {
          id: dish.id,
          name: dish.name,
          image: dish.image_url || dish.image,
          size,
          price,
          quantity,
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems(prevItems =>
      prevItems.filter(item => !(item.id === id && item.size === size))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    total,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;