import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/services';
import { siteConfig } from '@/config/siteConfig';

interface DishCardProps {
  dish: MenuItem;
  onAddToCart: (dish: MenuItem, quantity: number, selectedSize?: string) => void;
}

const DishCard = ({ dish, onAddToCart }: DishCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    dish.prices && Object.keys(dish.prices).length > 0 
      ? Object.keys(dish.prices)[0] 
      : 'regular'
  );

  const handleAddToCart = () => {
    // إنشاء نسخة من الطبق مع السعر والحجم المختار
    const dishWithSelectedSize = {
      ...dish,
      price: getCurrentPrice(),
      selectedSize: selectedSize,
      displayPrice: `${getCurrentPrice().toFixed(0)} ج.م`
    };
    
    onAddToCart(dishWithSelectedSize, quantity, selectedSize);
    setQuantity(1); // Reset quantity after adding
  };

  // حساب السعر الحالي بناءً على الحجم المختار
  const getCurrentPrice = () => {
    if (dish.prices && dish.prices[selectedSize]) {
      return dish.prices[selectedSize];
    }
    return dish.price;
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  
  // بناء رابط الصورة من الـ API
  const imageUrl = dish.image_url || '/placeholder-dish.jpg';

  return (
    <Card className="dish-card group h-full">
      <div className="relative overflow-hidden">
        <img
          src={dish.image_url || '/placeholder-dish.jpg'}
          alt={dish.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {dish.popular && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </span>
        )}
        <div className="absolute top-2 right-2">
          <span className="price-badge">
            {getCurrentPrice().toFixed(0)} ج.م
          </span>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {dish.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {dish.description}
          </p>
        </div>

        {/* Size Selector */}
        {dish.prices && Object.keys(dish.prices).length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-3">
              اختر الحجم
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(dish.prices).map(([size, price]) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`relative p-3 text-center rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedSize === size
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-200 bg-white hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-sm font-semibold ${
                      selectedSize === size ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {size === 'small' ? 'صغير' : 
                       size === 'medium' ? 'وسط' : 
                       size === 'large' ? 'كبير' : size}
                    </span>
                    <span className={`text-xs font-medium ${
                      selectedSize === size ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {price.toFixed(0)} ج.م
                    </span>
                  </div>
                  {selectedSize === size && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            الكمية
          </label>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg min-w-[3rem] text-center bg-gray-50 px-3 py-1 rounded-md">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="h-8 w-8 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="restaurant"
          onClick={handleAddToCart}
          className="w-full mt-auto py-3 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
        >
          إضافة للعربة • {(getCurrentPrice() * quantity).toFixed(0)} ج.م
        </Button>
      </CardContent>
    </Card>
  );
};

export default DishCard;