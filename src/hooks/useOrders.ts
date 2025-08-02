import { useState, useEffect, useRef } from 'react';
import { orderService, Order } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addNotification } = useNotificationContext();
  const previousOrdersRef = useRef<Order[]>([]);

  // جلب جميع الطلبات
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      
      toast({
        title: "تم تحديث حالة الطلب",
        description: `تم تغيير حالة الطلب #${orderId} إلى ${status}`,
      });
      
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "خطأ في تحديث الطلب",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      });
      throw err;
    }
  };

  // تحديث حالة الدفع
  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const updatedOrder = await orderService.updatePaymentStatus(orderId, paymentStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      
      toast({
        title: "تم تحديث حالة الدفع",
        description: `تم تغيير حالة الدفع للطلب #${orderId} إلى ${paymentStatus}`,
      });
      
      return updatedOrder;
    } catch (err) {
      console.error('Error updating payment status:', err);
      toast({
        title: "خطأ في تحديث الدفع",
        description: "حدث خطأ أثناء تحديث حالة الدفع",
        variant: "destructive",
      });
      throw err;
    }
  };

  // حذف طلب
  const deleteOrder = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: "تم حذف الطلب",
        description: `تم حذف الطلب #${orderId} بنجاح`,
      });
    } catch (err) {
      console.error('Error deleting order:', err);
      toast({
        title: "خطأ في حذف الطلب",
        description: "حدث خطأ أثناء حذف الطلب",
        variant: "destructive",
      });
      throw err;
    }
  };

  // مراقبة الطلبات الجديدة وإرسال إشعارات
  useEffect(() => {
    if (!loading && previousOrdersRef.current.length > 0) {
      const newOrders = orders.filter(order => 
        !previousOrdersRef.current.some(prevOrder => prevOrder.id === order.id)
      );
      
      newOrders.forEach(order => {
        addNotification({
          type: 'order',
          title: 'طلب جديد',
          message: `طلب جديد من ${order.customer_info?.name || 'ضيف'} بقيمة ${order.total_amount} جنيه`,
          data: { orderId: order.id, order }
        });
      });
    }
    
    // تحديث المرجع للطلبات السابقة
    if (!loading) {
      previousOrdersRef.current = [...orders];
    }
  }, [orders, loading, addNotification]);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    fetchOrders();
    
    // إعداد polling للتحديث التلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    refreshOrders: fetchOrders
  };
};
