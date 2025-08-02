import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import { useCart } from '@/contexts/CartContext';

const Layout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        cartItemsCount={itemCount} 
        onCartOpen={() => setIsCartOpen(true)} 
      />
      
      <main>
        <Outlet />
      </main>

      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default Layout;