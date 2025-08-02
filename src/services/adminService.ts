import api from '../config/api';
import { MenuItem } from './menuService';
import { Order } from './orderService';

export interface DashboardStats {
  total_users: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  new_bookings: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

class AdminService {
  // الحصول على إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  // الحصول على جميع المستخدمين
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  // تفعيل مستخدم
  async activateUser(userId: string): Promise<void> {
    try {
      await api.put(`/admin/users/${userId}/activate`);
    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  // إلغاء تفعيل مستخدم
  async deactivateUser(userId: string): Promise<void> {
    try {
      await api.put(`/admin/users/${userId}/deactivate`);
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  }

  // الحصول على التحليلات
  async getAnalytics(): Promise<any> {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  // رفع صورة
  async uploadImage(file: File): Promise<{ image_url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  // الحصول على جميع عناصر القائمة للإدارة
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await api.get('/admin/menu-items');
      return response.data;
    } catch (error) {
      console.error('Get all menu items error:', error);
      throw error;
    }
  }

  // إدارة القائمة - إضافة طبق جديد
  async addMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    try {
      const response = await api.post('/admin/menu-items', menuItem);
      return response.data;
    } catch (error) {
      console.error('Add menu item error:', error);
      throw error;
    }
  }

  // تحديث طبق في القائمة
  async updateMenuItem(itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await api.put(`/admin/menu-items/${itemId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update menu item error:', error);
      throw error;
    }
  }

  // حذف طبق من القائمة
  async deleteMenuItem(itemId: string): Promise<void> {
    try {
      await api.delete(`/admin/menu-items/${itemId}`);
    } catch (error) {
      console.error('Delete menu item error:', error);
      throw error;
    }
  }

  // الحصول على جميع الطلبات للإدارة
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }

  // تحديث حالة الطلب
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // تحديث حالة الدفع
  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}`, { payment_status: paymentStatus });
      return response.data;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;
