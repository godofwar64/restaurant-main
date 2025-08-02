import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DishCard from '@/components/DishCard';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  Package, 
  ChefHat, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Award,
  Utensils,
  Heart,
  Sparkles,
  ArrowRight,
  Quote
} from 'lucide-react';
import heroImage from '@/assets/hero-restaurant.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenu } from '@/hooks/useApi';
import { MenuItem } from '@/services';

const Index = () => {
  const { addToCart } = useCart();
  const { translations } = useLanguage();
  const { menu, loading, error } = useMenu();
  
  // فلترة الأطباق الشائعة - آخر طبق من كل فئة
  const getPopularDishes = () => {
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
    const popularDishes: MenuItem[] = [];
    
    categories.forEach(category => {
      const categoryDishes = menu.filter(dish => dish.category === category);
      if (categoryDishes.length > 0) {
        // أخد آخر طبق من الفئة (أحدث طبق تم إضافته)
        const latestDish = categoryDishes[categoryDishes.length - 1];
        popularDishes.push({ ...latestDish, popular: true });
      }
    });
    
    return popularDishes;
  };
  
  const popularDishes = getPopularDishes();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {translations.hero.title}<span className="text-primary-glow">{translations.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {translations.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="restaurant" size="lg" asChild>
              <Link to="/lunch">{translations.hero.exploreMenu}</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-foreground" asChild>
              <Link to="/booking">{translations.hero.makeReservation}</Link>
            </Button>
          </div>
        </div>
      </section>
      

      {/* Restaurant Info */}
      <section className="py-16 bg-restaurant-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.info.awardWinning.title}</h3>
                <p className="text-muted-foreground">
                  {translations.info.awardWinning.description}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.info.freshDaily.title}</h3>
                <p className="text-muted-foreground">
                  {translations.info.freshDaily.description}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.info.expertChefs.title}</h3>
                <p className="text-muted-foreground">
                  {translations.info.expertChefs.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                {translations.about.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {translations.about.paragraph1}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {translations.about.paragraph2}
              </p>
              <Button variant="restaurant" asChild>
                <Link to="/dinner">{translations.about.viewDinnerMenu}</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Restaurant interior"
                className="rounded-xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      

      {/* Popular Dishes */}
      <section className="py-16 bg-restaurant-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {translations.popularDishes.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {translations.popularDishes.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/breakfast">{translations.popularDishes.viewFullMenu}</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Order Tracking Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Package className="h-16 w-16 text-primary mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {translations.orderTracking.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {translations.orderTracking.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="restaurant" size="lg" asChild>
                    <Link to="/orders">
                      <Package className="h-5 w-5 mr-2" />
                      {translations.orderTracking.viewMyOrders}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/checkout">
                      {translations.orderTracking.newOrder}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">{translations.orderTracking.status.preparing}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">{translations.orderTracking.status.onTheWay}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium">{translations.orderTracking.status.delivered}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      {translations.orderTracking.averageDeliveryTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
