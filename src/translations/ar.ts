export const translations = {
  // Navigation
  navigation: {
    home: 'الرئيسية',
    breakfast: 'الإفطار',
    lunch: 'العشاء',
    dinner: 'الغداء',
    dessert: 'الحلويات',
    bookTable: 'حجز طاولة',
    cart: 'السلة'
  },

  // Hero Section
  hero: {
    title: 'مطعم',
    titleHighlight: 'منيو',
    subtitle: 'استمتع بتجربة طهي متميزة مع مكونات طازجة محلية المصدر مصنوعة في أطباق لا تُنسى',
    exploreMenu: 'استكشف القائمة',
    makeReservation: 'احجز طاولة'
  },

  // Restaurant Info
  info: {
    awardWinning: {
      title: 'حائز على جوائز',
      description: 'معترف به للتميز في الطهي والخدمة المتميزة'
    },
    freshDaily: {
      title: 'طازج يومياً',
      description: 'مكونات يتم الحصول عليها يومياً من المزارع والأسواق المحلية'
    },
    expertChefs: {
      title: 'طهاة خبراء',
      description: 'فنانون في الطهي متحمسون لخلق تجارب لا تُنسى'
    }
  },

  // About Section
  about: {
    title: 'قصتنا',
    paragraph1: 'تأسس مطعم منيو في عام 2010، وقد كرس جهوده لتقديم أرقى تجربة طهي مع التركيز على المكونات الطازجة الموسمية وتقنيات الطبخ المبتكرة.',
    paragraph2: 'يبدع فريقنا المتحمس من الطهاة كل طبق بعناية فائقة بالتفاصيل، مما يضمن أن تكون كل قضمة رحلة من النكهات التي تحتفل بالتقليد والابتكار معاً.',
    viewDinnerMenu: 'عرض قائمة العشاء'
  },

  // Popular Dishes
  popularDishes: {
    title: 'الأطباق الشائعة',
    subtitle: 'اكتشف إبداعاتنا الأكثر محبة، كل طبق مصنوع بعناية لتقديم تجربة طعام استثنائية',
    viewFullMenu: 'عرض القائمة الكاملة'
  },

  // Dish Card
  dishCard: {
    addToCart: 'أضف للسلة',
    sizes: {
      small: 'صغير',
      medium: 'متوسط',
      large: 'كبير'
    },
    currency: 'ر.س'
  },

  // Cart
  cart: {
    title: 'سلة التسوق',
    empty: 'السلة فارغة',
    total: 'المجموع',
    checkout: 'إتمام الطلب',
    remove: 'إزالة',
    quantity: 'الكمية'
  },

  // Menu Categories
  categories: {
    breakfast: {
      title: 'الإفطار',
      subtitle: 'ابدأ يومك بأطباق إفطار لذيذة مصنوعة من أجود المكونات'
    },
    lunch: {
      title: 'العشاء',
      subtitle: 'أطباق عشاء فاخرة لتجربة طعام لا تُنسى'
    },
    dinner: {
      title: 'الغداء',
      subtitle: 'وجبات غداء شهية ومشبعة لتناسب جميع الأذواق'
    },
    dessert: {
      title: 'الحلويات',
      subtitle: 'اختتم وجبتك بحلويات شهية ولذيذة'
    }
  },

  // Booking
  booking: {
    title: 'حجز طاولة',
    subtitle: 'احجز طاولتك الآن واستمتع بتجربة طعام رائعة',
    form: {
      title:'تفاصيل الحجز',
      subtitle:'رجاء ملء بياناتك لتاكيد الحجز',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      date: 'التاريخ',
      time: 'الوقت',
      guests: 'عدد الأشخاص',
      submit: 'تأكيد الحجز'
    }
  },

  // Order Tracking
  orderTracking: {
    title: 'تتبع طلباتك',
    description: 'ابقَ على اطلاع على حالة طلباتك. يمكنك متابعة تقدم طلبك من التحضير حتى التوصيل بكل سهولة.',
    viewMyOrders: 'عرض طلباتي',
    newOrder: 'طلب جديد',
    status: {
      preparing: 'قيد التحضير',
      onTheWay: 'في الطريق',
      delivered: 'تم التوصيل'
    },
    averageDeliveryTime: 'متوسط وقت التوصيل: 30-45 دقيقة'
  },

  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    close: 'إغلاق'
  }
};

export type TranslationKey = keyof typeof translations;
