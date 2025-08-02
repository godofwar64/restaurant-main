import { Dish } from '@/components/DishCard';
import pancakesImg from '@/assets/pancakes.jpg';
import eggsBenedictImg from '@/assets/eggs-benedict.jpg';
import avocadoToastImg from '@/assets/avocado-toast.jpg';
import burgerImg from '@/assets/burger.jpg';
import caesarSaladImg from '@/assets/caesar-salad.jpg';
import salmonImg from '@/assets/salmon.jpg';
import chocolateCakeImg from '@/assets/chocolate-cake.jpg';

export const menuData: Dish[] = [
  // Breakfast
  {
    id: 'pancakes',
    name: 'بان كيك محشي',
    description: 'ثلاث قطع من البان كيك الرقيق مع التوت الطازج والكريمة المخفوقة وشراب القيقب الطبيعي',
    image: pancakesImg,
    prices: { small: 35, medium: 50, large: 65 },
    category: 'breakfast',
    popular: true,
  },
  {
    id: 'eggs-benedict',
    name: 'بيض بنديكت',
    description: 'بيض مسلوق على خبز إنجليزي مع لحم البيكون الكندي وصلصة الهولانديز',
    image: eggsBenedictImg,
    prices: { small: 45, medium: 60, large: 75 },
    category: 'breakfast',
  },
  {
    id: 'avocado-toast',
    name: 'توست الأفوكادو',
    description: 'أفوكادو مهروس على خبز العجين المخمر مع طماطم كرزية وجبنة الفيتا وصلصة البلسميك',
    image: avocadoToastImg,
    prices: { small: 38, medium: 52, large: 68 },
    category: 'breakfast',
  },

  // Lunch
  {
    id: 'gourmet-burger',
    name: 'برجر لحم فاخر',
    description: 'قطعة لحم بقري مع جبنة الشيدر المعتقة وبصل مكرمل وخس وطماطم وصلصة الكمأة',
    image: burgerImg,
    prices: { small: 58, medium: 72, large: 88 },
    category: 'lunch',
    popular: true,
  },
  {
    id: 'caesar-salad',
    name: 'سلطة سيزر',
    description: 'خس روماني مقرمش مع جبنة البارميزان وخبز محمص وصلصة سيزر معمولة بالبيت',
    image: caesarSaladImg,
    prices: { small: 42, medium: 56, large: 72 },
    category: 'lunch',
  },
  {
    id: 'club-sandwich',
    name: 'ساندويتش نادي',
    description: 'ساندويتش ثلاثي الطبقات مع لحم الديك الرومي والبيكون والخس والطماطم والمايونيز',
    image: burgerImg, // Using burger as placeholder
    prices: { small: 49, medium: 64, large: 79 },
    category: 'lunch',
  },

  // Dinner
  {
    id: 'grilled-salmon',
    name: 'Grilled Atlantic Salmon',
    description: 'Fresh salmon fillet with roasted vegetables, quinoa, and lemon herb butter',
    image: salmonImg,
    prices: { small: 22.99, medium: 28.99, large: 34.99 },
    category: 'dinner',
    popular: true,
  },
  {
    id: 'ribeye-steak',
    name: 'Ribeye Steak',
    description: 'Premium aged ribeye with garlic mashed potatoes and seasonal vegetables',
    image: salmonImg, // Using salmon as placeholder
    prices: { small: 28.99, medium: 36.99, large: 44.99 },
    category: 'dinner',
  },
  {
    id: 'pasta-carbonara',
    name: 'Pasta Carbonara',
    description: 'Fresh fettuccine with pancetta, eggs, parmesan cheese, and black pepper',
    image: salmonImg, // Using salmon as placeholder
    prices: { small: 16.99, medium: 21.99, large: 26.99 },
    category: 'dinner',
  },

  // Dessert
  {
    id: 'chocolate-cake',
    name: 'Decadent Chocolate Cake',
    description: 'Rich chocolate layer cake with ganache frosting and fresh berries',
    image: chocolateCakeImg,
    prices: { small: 7.99, medium: 10.99, large: 13.99 },
    category: 'dessert',
    popular: true,
  },
  {
    id: 'tiramisu',
    name: 'Classic Tiramisu',
    description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone',
    image: chocolateCakeImg, // Using chocolate cake as placeholder
    prices: { small: 8.99, medium: 11.99, large: 14.99 },
    category: 'dessert',
  },
  {
    id: 'crème-brulee',
    name: 'Crème Brûlée',
    description: 'Vanilla custard with a caramelized sugar crust, served with fresh berries',
    image: chocolateCakeImg, // Using chocolate cake as placeholder
    prices: { small: 9.99, medium: 12.99, large: 15.99 },
    category: 'dessert',
  },
];

export const getDishesByCategory = (category: string) => {
  return menuData.filter(dish => dish.category === category);
};

export const getPopularDishes = () => {
  return menuData.filter(dish => dish.popular);
};