// تصدير جميع الخدمات من مكان واحد
export { default as authService } from './authService';
export { default as menuService } from './menuService';
export { default as orderService } from './orderService';
export { default as adminService } from './adminService';

// تصدير الواجهات والأنواع
export type { LoginCredentials, RegisterData, User, AuthResponse } from './authService';
export type { MenuItem } from './menuService';
export type { OrderItem, CustomerInfo, CreateOrderData, Order } from './orderService';
export type { DashboardStats, AdminUser } from './adminService';
