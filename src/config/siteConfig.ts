import { link } from "fs";

// ملف التكوين الرئيسي للمنصة - يمكن تخصيص جميع المعلومات من هنا
export const siteConfig = {
  //معلومات ال api
  api:{
    MAIN_API_URL: 'http://0.0.0.0:8000'
  },
  // معلومات المطعم الأساسية
  restaurant: {
    name: {
      ar: 'مطعم منيو',
      en: 'restaurantFresh'
    },
    logo: {
      text: 'restaurant',
      highlight: 'Fresh',
      // يمكن إضافة مسار للوجو هنا إذا كان لديك صورة
      // logoImage: '/logo.png'
    },
    tagline: {
      ar: 'استمتع بتجربة طهي متميزة مع مكونات طازجة محلية المصدر مصنوعة في أطباق لا تُنسى',
      en: 'Experience culinary excellence with fresh, locally-sourced ingredients crafted into unforgettable dishes'
    },
    description: {
      ar: {
        title: 'قصتنا',
        paragraph1: 'تأسس مطعم منيو في عام 2010، وقد كرس جهوده لتقديم أرقى تجربة طهي مع التركيز على المكونات الطازجة الموسمية وتقنيات الطبخ المبتكرة.',
        paragraph2: 'يبدع فريقنا المتحمس من الطهاة كل طبق بعناية فائقة بالتفاصيل، مما يضمن أن تكون كل قضمة رحلة من النكهات التي تحتفل بالتقليد والابتكار معاً.',
        foundedYear: 2010
      },
      en: {
        title: 'Our Story',
        paragraph1: 'Founded in 2010, restaurantFresh has been dedicated to bringing you the finest culinary experience with a focus on fresh, seasonal ingredients and innovative cooking techniques.',
        paragraph2: 'Our passionate team of chefs creates each dish with meticulous attention to detail, ensuring every bite is a journey of flavors that celebrates both tradition and innovation.',
        foundedYear: 2010
      }
    }
  },

  // معلومات الاتصال
  contact: {
    phone: '+966 12 345 6789',
    email: 'info@restaurantfresh.com',
    address: {
      ar: 'شارع التحلية، حي السليمانية، الرياض، المملكة العربية السعودية',
      en: 'Tahlia Street, Al Sulimaniyah, Riyadh, Saudi Arabia'
    },
    location: {
      lat: 24.7136,
      lng: 46.6753
    },
    workingHours: {
      ar: {
        weekdays: 'السبت - الخميس: 8:00 ص - 11:00 م',
        friday: 'الجمعة: 2:00 م - 11:00 م'
      },
      en: {
        weekdays: 'Sat - Thu: 8:00 AM - 11:00 PM',
        friday: 'Friday: 2:00 PM - 11:00 PM'
      }
    }
  },

  // الصور
  images: {
    hero: '/src/assets/hero-restaurant.jpg',
    about: '/src/assets/hero-restaurant.jpg',
    // يمكن إضافة المزيد من الصور هنا
    gallery: [
      '/src/assets/hero-restaurant.jpg',
      // أضف المزيد من صور المعرض هنا
    ]
  },

  // الألوان والتصميم
  theme: {
    colors: {
      primary: '#f97316', // البرتقالي الأساسي
      primaryGlow: '#fb923c', // البرتقالي المتوهج
      accent: '#16a34a', // الأخضر
      background: '#fefbf4', // الخلفية الكريمية
      restaurantCream: '#fdf6e8',
    },
    fonts: {
      arabic: 'Cairo',
      english: 'Inter'
    }
  },

  // العملة والأسعار
  currency: {
    symbol: 'ر.س',
    code: 'SAR',
    // يمكن تعديل العملة هنا للدول الأخرى
    // symbol: '$', code: 'USD'
    // symbol: '€', code: 'EUR'
  },

  // مميزات المطعم
  features: {
    ar: [
      {
        title: 'حائز على جوائز',
        description: 'معترف به للتميز في الطهي والخدمة المتميزة',
        icon: 'Star'
      },
      {
        title: 'طازج يومياً',
        description: 'مكونات يتم الحصول عليها يومياً من المزارع والأسواق المحلية',
        icon: 'Clock'
      },
      {
        title: 'طهاة خبراء',
        description: 'فنانون في الطهي متحمسون لخلق تجارب لا تُنسى',
        icon: 'Users'
      }
    ],
    en: [
      {
        title: 'Award Winning',
        description: 'Recognized for culinary excellence and outstanding service',
        icon: 'Star'
      },
      {
        title: 'Fresh Daily',
        description: 'Ingredients sourced daily from local farms and markets',
        icon: 'Clock'
      },
      {
        title: 'Expert Chefs',
        description: 'Passionate culinary artists creating memorable experiences',
        icon: 'Users'
      }
    ]
  },

  // روابط التواصل الاجتماعي
  socialMedia: {
    facebook: 'https://facebook.com/restaurantfresh',
    instagram: 'https://instagram.com/restaurantfresh',
    twitter: 'https://twitter.com/restaurantfresh',
    whatsapp: '+966123456789',
    youtube: 'https://youtube.com/@restaurantfresh'
  },

  // إعدادات الحجز
  booking: {
    enabled: true,
    maxGuests: 12,
    advanceBookingDays: 30,
    minAdvanceHours: 2,
    timeSlots: [
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
    ]
  },

  // إعدادات الدفع والتوصيل
  payment: {
    methods: ['cash', 'card', 'online'],
    delivery: {
      enabled: true,
      fee: 15,
      freeDeliveryMinimum: 100,
      radius: 25 // بالكيلومتر
    },
    tax: 0.15 // 15% ضريبة القيمة المضافة
  },

  // معلومات الإدارة
  admin: {
    credentials: {
      username: 'admin',
      password: 'admin123'
    },
    // يمكن إضافة المزيد من المستخدمين هنا
    users: [
      {
        username: 'admin',
        password: 'admin123',
        role: 'super_admin'
      },
      {
        username: 'manager',
        password: 'manager123',
        role: 'manager'
      }
    ]
  },

  // إعدادات SEO
  seo: {
    title: {
      ar: 'مطعم منيو - أفضل مطعم في الرياض',
      en: 'restaurantFresh - Best Restaurant in Riyadh'
    },
    description: {
      ar: 'استمتع بأفضل تجربة طعام في مطعم منيو. مطعم فاخر يقدم أشهى الأطباق العالمية والمحلية بأجود المكونات الطازجة.',
      en: 'Enjoy the best dining experience at restaurantFresh. Luxury restaurant serving delicious international and local dishes with the finest fresh ingredients.'
    },
    keywords: {
      ar: ['مطعم', 'طعام', 'الرياض', 'فاخر', 'طازج', 'أطباق عالمية'],
      en: ['restaurant', 'food', 'riyadh', 'luxury', 'fresh', 'international cuisine']
    }
  },

  // إعدادات اللغة
  language: {
    default: 'ar',
    supported: ['ar', 'en'],
    rtl: ['ar']
  },

  // إعدادات الإشعارات
  notifications: {
    email: {
      enabled: true,
      adminEmail: 'admin@restaurantfresh.com'
    },
    sms: {
      enabled: true,
      provider: 'twilio' // أو أي مزود آخر
    }
  },

  // إعدادات التطبيق
  app: {
    name: 'Restaurent Menus',
    version: '1.0.0',
    environment: 'development', // تم تغييرها إلى development
    apiUrl: 'http://localhost:8000/api', // استخدام الـ API المحلي
    cdnUrl: 'http://localhost:8000/uploads' // مجلد الصور المحلي
  }
};

// دالة لتحديث التكوين بسهولة
export const updateConfig = (path: string, value: any) => {
  const keys = path.split('.');
  let current: any = siteConfig;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
};

// دالة للحصول على قيمة من التكوين
export const getConfig = (path: string) => {
  const keys = path.split('.');
  let current: any = siteConfig;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
};
