import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  cartItemsCount: number;
  onCartOpen: () => void;
}

const Navigation = ({ cartItemsCount, onCartOpen }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { translations, toggleLanguage, language } = useLanguage();

  const navItems = [
    { path: '/', label: translations.navigation.home },
    { path: '/breakfast', label: translations.navigation.breakfast },
    { path: '/dinner', label: translations.navigation.dinner },
    { path: '/lunch', label: translations.navigation.lunch },
    { path: '/dessert', label: translations.navigation.dessert },
    { path: '/booking', label: translations.navigation.bookTable },
  ];

  return (
    <nav className="bg-card shadow-lg border-b border-border/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-primary">
              restaurant<span className="text-accent">Fresh</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Languages className="h-4 w-4" />
              {language === 'ar' ? 'EN' : 'ع'}
            </Button>
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartOpen}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;