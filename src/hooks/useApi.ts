import { useState, useEffect } from 'react';
import { menuService, orderService, adminService, authService } from '../services';
import type { MenuItem, Order, DashboardStats } from '../services';

// Hook للحصول على قائمة الطعام
export const useMenu = (category?: string, availableOnly: boolean = true) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuService.getMenu(category, availableOnly);
        setMenu(data);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل القائمة');
        console.error('Menu fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [category, availableOnly]);

  return { menu, loading, error, refetch: () => fetchMenu() };
};

// Hook للحصول على الفئات
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await menuService.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل الفئات');
        console.error('Categories fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook للأدمن للحصول على الطلبات
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل الطلبات');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated() && authService.isAdmin()) {
      fetchOrders();
    }
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};

// Hook للأدمن للحصول على إحصائيات لوحة التحكم
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل الإحصائيات');
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated() && authService.isAdmin()) {
      fetchStats();
    }
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook عام للطلبات مع إدارة الحالة
export const useOrderSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitGuestOrder = async (orderData: any) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await orderService.createGuestOrder(orderData);
      setSuccess(true);
    } catch (err) {
      setError('فشل في إرسال الطلب');
      console.error('Order submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return { submitGuestOrder, loading, error, success, resetStatus };
};
