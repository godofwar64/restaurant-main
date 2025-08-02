import { title } from "process";

export const translations = {
  // Navigation
  navigation: {
    home: 'Home',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    dessert: 'Dessert',
    bookTable: 'Book Table',
    cart: 'Cart'
  },

  // Hero Section
  hero: {
    title: 'restaurant',
    titleHighlight: 'Fresh',
    subtitle: 'Experience culinary excellence with fresh, locally-sourced ingredients crafted into unforgettable dishes',
    exploreMenu: 'Explore Menu',
    makeReservation: 'Make Reservation'
  },

  // Restaurant Info
  info: {
    awardWinning: {
      title: 'Award Winning',
      description: 'Recognized for culinary excellence and outstanding service'
    },
    freshDaily: {
      title: 'Fresh Daily',
      description: 'Ingredients sourced daily from local farms and markets'
    },
    expertChefs: {
      title: 'Expert Chefs',
      description: 'Passionate culinary artists creating memorable experiences'
    }
  },

  // About Section
  about: {
    title: 'Our Story',
    paragraph1: 'Founded in 2010, restaurantFresh has been dedicated to bringing you the finest culinary experience with a focus on fresh, seasonal ingredients and innovative cooking techniques.',
    paragraph2: 'Our passionate team of chefs creates each dish with meticulous attention to detail, ensuring every bite is a journey of flavors that celebrates both tradition and innovation.',
    viewDinnerMenu: 'View Dinner Menu'
  },

  // Popular Dishes
  popularDishes: {
    title: 'Popular Dishes',
    subtitle: 'Discover our most loved creations, each dish carefully crafted to deliver an exceptional dining experience',
    viewFullMenu: 'View Full Menu'
  },

  // Dish Card
  dishCard: {
    addToCart: 'Add to Cart',
    sizes: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large'
    },
    currency: 'SAR'
  },

  // Cart
  cart: {
    title: 'Shopping Cart',
    empty: 'Cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    remove: 'Remove',
    quantity: 'Quantity'
  },

  // Menu Categories
  categories: {
    breakfast: {
      title: 'Breakfast',
      subtitle: 'Start your day with delicious breakfast dishes made from the finest ingredients'
    },
    lunch: {
      title: 'Lunch',
      subtitle: 'Delicious and satisfying lunch meals to suit all tastes'
    },
    dinner: {
      title: 'Dinner',
      subtitle: 'Luxurious dinner dishes for an unforgettable dining experience'
    },
    dessert: {
      title: 'Desserts',
      subtitle: 'End your meal with delicious and sweet desserts'
    }
  },

  // Booking
  booking: {
    title: 'Book a Table',
    subtitle: 'Book your table now and enjoy a wonderful dining experience',
    form: {
      title:'Reservation Details',
      subtitle:'Please fill in your details to complete your booking',
      name: 'Name',
      phone: 'Phone Number',
      email: 'Email',
      date: 'Date',
      time: 'Time',
      guests: 'Number of Guests',
      submit: 'Confirm Booking'
    }
  },

  // Order Tracking
  orderTracking: {
    title: 'Track Your Orders',
    description: 'Stay updated on your order status. You can easily follow your order progress from preparation to delivery.',
    viewMyOrders: 'View My Orders',
    newOrder: 'New Order',
    status: {
      preparing: 'Preparing',
      onTheWay: 'On the Way',
      delivered: 'Delivered'
    },
    averageDeliveryTime: 'Average delivery time: 30-45 minutes'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close'
  }
};

export type TranslationKey = keyof typeof translations;
