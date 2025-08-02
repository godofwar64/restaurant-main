import api from '../config/api';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  total_amount: number;
  customer_info: CustomerInfo;
  special_instructions?: string;
  delivery_address?: string;
  payment_method?: 'cash' | 'card' | 'online';
}

export interface Order {
  id: string;
  user_id?: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  payment_status: string;
  customer_info?: CustomerInfo;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

class OrderService {
  // إنشاء طلب جديد للعملاء غير المسجلين
  async createGuestOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post('/orders/guest', orderData);
      return response.data;
    } catch (error) {
      console.error('Create guest order error:', error);
      throw error;
    }
  }

  // إنشاء طلب جديد للعملاء المسجلين
  async createOrder(orderData: Omit<CreateOrderData, 'customer_info'>): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // الحصول على جميع الطلبات (للإدارة)
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }

  // الحصول على طلب محدد
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
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

  // حذف طلب
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  }

  // الحصول على إحصائيات الطلبات
  async getOrderStats(): Promise<any> {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;
