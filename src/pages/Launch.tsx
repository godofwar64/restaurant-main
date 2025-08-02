import DishCard from '@/components/DishCard';
import { useCart } from '@/contexts/CartContext';
import { getDishesByCategory } from '@/data/menu';
import { useLanguage } from '@/contexts/LanguageContext';

const Lunch = () => {
  const { addToCart } = useCart();
  const lunchDishes = getDishesByCategory('lunch');
  const { translations } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {translations.categories.lunch.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {translations.categories.lunch.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lunchDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Lunch;