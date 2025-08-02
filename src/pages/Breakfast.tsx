import DishCard from '@/components/DishCard';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenu } from '@/hooks/useApi';

const Breakfast = () => {
  const { addToCart } = useCart();
  const { menu: breakfastDishes, loading, error } = useMenu("Breakfast");
  const { translations } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {translations.categories.breakfast.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {translations.categories.breakfast.subtitle}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل القائمة...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfastDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Breakfast;