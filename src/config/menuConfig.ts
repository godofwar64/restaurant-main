// ملف تكوين القائمة - يمكن تخصيص جميع الأطباق والفئات من هنا
import { Dish } from '@/components/DishCard';

export const menuConfig = {
  // فئات القائمة
  categories: {
    ar: [
      { id: 'breakfast', name: 'الإفطار', description: 'ابدأ يومك بأطباق إفطار لذيذة مصنوعة من أجود المكونات' },
      { id: 'lunch', name: 'الغداء', description: 'وجبات غداء شهية ومشبعة لتناسب جميع الأذواق' },
      { id: 'dinner', name: 'العشاء', description: 'أطباق عشاء فاخرة لتجربة طعام لا تُنسى' },
      { id: 'dessert', name: 'الحلويات', description: 'اختتم وجبتك بحلويات شهية ولذيذة' }
    ],
    en: [
      { id: 'breakfast', name: 'Breakfast', description: 'Start your day with delicious breakfast dishes made from the finest ingredients' },
      { id: 'lunch', name: 'Lunch', description: 'Delicious and satisfying lunch meals to suit all tastes' },
      { id: 'dinner', name: 'Dinner', description: 'Luxurious dinner dishes for an unforgettable dining experience' },
      { id: 'dessert', name: 'Desserts', description: 'End your meal with delicious and sweet desserts' }
    ]
  },

  // الأطباق
  dishes: [
    // أطباق الإفطار
    {
      id: 'pancakes',
      name: {
        ar: 'بان كيك محشي',
        en: 'Fluffy Pancakes'
      },
      description: {
        ar: 'ثلاث قطع من البان كيك الرقيق مع التوت الطازج والكريمة المخفوقة وشراب القيقب الطبيعي',
        en: 'Stack of three fluffy pancakes with fresh berries, whipped cream, and pure maple syrup'
      },
      image: '/src/assets/pancakes.jpg',
      prices: { small: 35, medium: 50, large: 65 },
      category: 'breakfast',
      popular: true,
      ingredients: {
        ar: ['دقيق', 'بيض', 'حليب', 'توت طازج', 'شراب القيقب'],
        en: ['Flour', 'Eggs', 'Milk', 'Fresh berries', 'Maple syrup']
      },
      allergens: {
        ar: ['الجلوتين', 'البيض', 'منتجات الألبان'],
        en: ['Gluten', 'Eggs', 'Dairy']
      },
      nutrition: {
        calories: 450,
        protein: 12,
        carbs: 65,
        fat: 18
      },
      preparationTime: 15, // بالدقائق
      spicyLevel: 0, // من 0 إلى 5
      vegetarian: true,
      vegan: false,
      glutenFree: false
    },
    {
      id: 'eggs-benedict',
      name: {
        ar: 'بيض بنديكت',
        en: 'Eggs Benedict'
      },
      description: {
        ar: 'بيض مسلوق على خبز إنجليزي مع لحم البيكون الكندي وصلصة الهولانديز',
        en: 'Poached eggs on English muffins with Canadian bacon and hollandaise sauce'
      },
      image: '/src/assets/eggs-benedict.jpg',
      prices: { small: 45, medium: 60, large: 75 },
      category: 'breakfast',
      popular: false,
      ingredients: {
        ar: ['بيض', 'خبز إنجليزي', 'بيكون كندي', 'صلصة هولانديز'],
        en: ['Eggs', 'English muffins', 'Canadian bacon', 'Hollandaise sauce']
      },
      allergens: {
        ar: ['البيض', 'الجلوتين', 'منتجات الألبان'],
        en: ['Eggs', 'Gluten', 'Dairy']
      },
      nutrition: {
        calories: 520,
        protein: 28,
        carbs: 32,
        fat: 34
      },
      preparationTime: 20,
      spicyLevel: 0,
      vegetarian: false,
      vegan: false,
      glutenFree: false
    },
    {
      id: 'avocado-toast',
      name: {
        ar: 'توست الأفوكادو',
        en: 'Avocado Toast'
      },
      description: {
        ar: 'أفوكادو مهروس على خبز العجين المخمر مع طماطم كرزية وجبنة الفيتا وصلصة البلسميك',
        en: 'Smashed avocado on sourdough with cherry tomatoes, feta cheese, and balsamic glaze'
      },
      image: '/src/assets/avocado-toast.jpg',
      prices: { small: 38, medium: 52, large: 68 },
      category: 'breakfast',
      popular: false,
      ingredients: {
        ar: ['أفوكادو', 'خبز محمص', 'طماطم كرزية', 'جبنة فيتا', 'بلسميك'],
        en: ['Avocado', 'Sourdough bread', 'Cherry tomatoes', 'Feta cheese', 'Balsamic glaze']
      },
      allergens: {
        ar: ['الجلوتين', 'منتجات الألبان'],
        en: ['Gluten', 'Dairy']
      },
      nutrition: {
        calories: 380,
        protein: 15,
        carbs: 42,
        fat: 22
      },
      preparationTime: 10,
      spicyLevel: 0,
      vegetarian: true,
      vegan: false,
      glutenFree: false
    },

    // أطباق الغداء
    {
      id: 'gourmet-burger',
      name: {
        ar: 'برجر لحم فاخر',
        en: 'Gourmet Beef Burger'
      },
      description: {
        ar: 'قطعة لحم بقري مع جبنة الشيدر المعتقة وبصل مكرمل وخس وطماطم وصلصة الكمأة',
        en: 'Grass-fed beef patty with aged cheddar, caramelized onions, lettuce, tomato, and truffle aioli'
      },
      image: '/src/assets/burger.jpg',
      prices: { small: 58, medium: 72, large: 88 },
      category: 'lunch',
      popular: true,
      ingredients: {
        ar: ['لحم بقري', 'جبنة شيدر', 'بصل مكرمل', 'خس', 'طماطم', 'صلصة الكمأة'],
        en: ['Beef patty', 'Aged cheddar', 'Caramelized onions', 'Lettuce', 'Tomato', 'Truffle aioli']
      },
      allergens: {
        ar: ['الجلوتين', 'منتجات الألبان', 'البيض'],
        en: ['Gluten', 'Dairy', 'Eggs']
      },
      nutrition: {
        calories: 680,
        protein: 35,
        carbs: 48,
        fat: 42
      },
      preparationTime: 18,
      spicyLevel: 1,
      vegetarian: false,
      vegan: false,
      glutenFree: false
    },
    {
      id: 'caesar-salad',
      name: {
        ar: 'سلطة سيزر',
        en: 'Caesar Salad'
      },
      description: {
        ar: 'خس روماني مقرمش مع جبنة البارميزان وخبز محمص وصلصة سيزر معمولة بالبيت',
        en: 'Crisp romaine lettuce with parmesan cheese, croutons, and house-made caesar dressing'
      },
      image: '/src/assets/caesar-salad.jpg',
      prices: { small: 42, medium: 56, large: 72 },
      category: 'lunch',
      popular: false,
      ingredients: {
        ar: ['خس روماني', 'جبنة بارميزان', 'خبز محمص', 'صلصة سيزر'],
        en: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing']
      },
      allergens: {
        ar: ['الجلوتين', 'منتجات الألبان', 'الأنشوفة'],
        en: ['Gluten', 'Dairy', 'Anchovies']
      },
      nutrition: {
        calories: 320,
        protein: 18,
        carbs: 25,
        fat: 20
      },
      preparationTime: 8,
      spicyLevel: 0,
      vegetarian: true,
      vegan: false,
      glutenFree: false
    },

    // أطباق العشاء
    {
      id: 'grilled-salmon',
      name: {
        ar: 'سمك السلمون المشوي',
        en: 'Grilled Atlantic Salmon'
      },
      description: {
        ar: 'قطعة سلمون طازجة مع خضروات محمصة وكينوا وزبدة الليمون والأعشاب',
        en: 'Fresh salmon fillet with roasted vegetables, quinoa, and lemon herb butter'
      },
      image: '/src/assets/salmon.jpg',
      prices: { small: 87, medium: 110, large: 132 },
      category: 'dinner',
      popular: true,
      ingredients: {
        ar: ['سلمون أطلسي', 'خضروات محمصة', 'كينوا', 'زبدة الليمون'],
        en: ['Atlantic salmon', 'Roasted vegetables', 'Quinoa', 'Lemon herb butter']
      },
      allergens: {
        ar: ['السمك', 'منتجات الألبان'],
        en: ['Fish', 'Dairy']
      },
      nutrition: {
        calories: 520,
        protein: 42,
        carbs: 35,
        fat: 25
      },
      preparationTime: 25,
      spicyLevel: 0,
      vegetarian: false,
      vegan: false,
      glutenFree: true
    },

    // الحلويات
    {
      id: 'chocolate-cake',
      name: {
        ar: 'كيكة الشوكولاتة iuhik',
        en: 'Decadent hkjhkuguyj Cake'
      },
      description: {
        ar: 'كيكة شوكولاتة طبقات غنية مع كريمة الجاناش والتوت الطازج',
        en: 'Rich chocolate layer cake with ganache frosting and fresh berries'
      },
      image: '/src/assets/chocolate-cake.jpg',
      prices: { small: 30, medium: 42, large: 55 },
      category: 'dessert',
      popular: true,
      ingredients: {
        ar: ['شوكولاتة داكنة', 'دقيق', 'بيض', 'زبدة', 'توت طازج'],
        en: ['Dark chocolate', 'Flour', 'Eggs', 'Butter', 'Fresh berries']
      },
      allergens: {
        ar: ['الجلوتين', 'البيض', 'منتجات الألبان'],
        en: ['Gluten', 'Eggs', 'Dairy']
      },
      nutrition: {
        calories: 420,
        protein: 8,
        carbs: 55,
        fat: 22
      },
      preparationTime: 35,
      spicyLevel: 0,
      vegetarian: true,
      vegan: false,
      glutenFree: false
    }
  ],

  // إعدادات عامة للقائمة
  settings: {
    showNutrition: true,
    showAllergens: true,
    showPreparationTime: true,
    showSpicyLevel: true,
    showDietaryInfo: true,
    currency: {
      symbol: 'ر.س',
      position: 'after' // 'before' or 'after'
    },
    sizesEnabled: true,
    sizes: {
      ar: {
        small: 'صغير',
        medium: 'متوسط',
        large: 'كبير'
      },
      en: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      }
    }
  }
};

// دالة للحصول على الأطباق حسب الفئة
export const getDishesByCategory = (category: string): Dish[] => {
  return menuConfig.dishes
    .filter(dish => dish.category === category)
    .map(dish => ({
      id: dish.id,
      name: dish.name.ar, // يمكن تغييرها حسب اللغة المختارة
      description: dish.description.ar,
      image: dish.image,
      prices: dish.prices,
      category: dish.category,
      popular: dish.popular
    }));
};

// دالة للحصول على الأطباق الشائعة
export const getPopularDishes = (): Dish[] => {
  return menuConfig.dishes
    .filter(dish => dish.popular)
    .map(dish => ({
      id: dish.id,
      name: dish.name.ar,
      description: dish.description.ar,
      image: dish.image,
      prices: dish.prices,
      category: dish.category,
      popular: dish.popular
    }));
};

// دالة لإضافة طبق جديد
export const addDish = (dish: any) => {
  menuConfig.dishes.push(dish);
};

// دالة لتحديث طبق موجود
export const updateDish = (dishId: string, updates: any) => {
  const dishIndex = menuConfig.dishes.findIndex(dish => dish.id === dishId);
  if (dishIndex !== -1) {
    menuConfig.dishes[dishIndex] = { ...menuConfig.dishes[dishIndex], ...updates };
  }
};

// دالة لحذف طبق
export const deleteDish = (dishId: string) => {
  const dishIndex = menuConfig.dishes.findIndex(dish => dish.id === dishId);
  if (dishIndex !== -1) {
    menuConfig.dishes.splice(dishIndex, 1);
  }
};
