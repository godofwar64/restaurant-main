import { useState, useEffect, useRef } from 'react';
import { reservationService, Reservation } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { useNotificationContext } from '@/contexts/NotificationContext';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addNotification } = useNotificationContext();
  const previousReservationsRef = useRef<Reservation[]>([]);

  // جلب جميع الحجوزات
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const reservationsData = await reservationService.getAllReservations();
      setReservations(reservationsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('فشل في تحميل الحجوزات');
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الحجز
  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const updatedReservation = await reservationService.updateReservationStatus(reservationId, status);
      setReservations(prev => prev.map(reservation => 
        reservation.id === reservationId ? updatedReservation : reservation
      ));
      
      const statusText = status === 'confirmed' ? 'مؤكد' : 
                        status === 'cancelled' ? 'ملغي' : 
                        status === 'pending' ? 'قيد الانتظار' : status;
      
      toast({
        title: "تم تحديث حالة الحجز",
        description: `تم تغيير حالة الحجز #${reservationId} إلى ${statusText}`,
      });
      
      return updatedReservation;
    } catch (err) {
      console.error('Error updating reservation status:', err);
      toast({
        title: "خطأ في تحديث الحجز",
        description: "حدث خطأ أثناء تحديث حالة الحجز",
        variant: "destructive",
      });
      throw err;
    }
  };

  // إنشاء حجز جديد
  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newReservation = await reservationService.createReservation(reservationData);
      setReservations(prev => [newReservation, ...prev]);
      
      toast({
        title: "تم إنشاء الحجز",
        description: `تم إنشاء حجز جديد للعميل ${reservationData.customerName}`,
      });
      
      return newReservation;
    } catch (err) {
      console.error('Error creating reservation:', err);
      toast({
        title: "خطأ في إنشاء الحجز",
        description: "حدث خطأ أثناء إنشاء الحجز",
        variant: "destructive",
      });
      throw err;
    }
  };

  // تحديث بيانات الحجز
  const updateReservation = async (reservationId: string, updates: Partial<Reservation>) => {
    try {
      const updatedReservation = await reservationService.updateReservation(reservationId, updates);
      setReservations(prev => prev.map(reservation => 
        reservation.id === reservationId ? updatedReservation : reservation
      ));
      
      toast({
        title: "تم تحديث الحجز",
        description: `تم تحديث بيانات الحجز #${reservationId}`,
      });
      
      return updatedReservation;
    } catch (err) {
      console.error('Error updating reservation:', err);
      toast({
        title: "خطأ في تحديث الحجز",
        description: "حدث خطأ أثناء تحديث الحجز",
        variant: "destructive",
      });
      throw err;
    }
  };

  // حذف حجز
  const deleteReservation = async (reservationId: string) => {
    try {
      await reservationService.deleteReservation(reservationId);
      setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));
      toast({
        title: "تم حذف الحجز",
        description: `تم حذف الحجز #${reservationId} بنجاح`,
      });
    } catch (err) {
      console.error('Error deleting reservation:', err);
      toast({
        title: "خطأ في حذف الحجز",
        description: "حدث خطأ أثناء حذف الحجز",
        variant: "destructive",
      });
      throw err;
    }
  };

  // مراقبة الحجوزات الجديدة وإرسال إشعارات
  useEffect(() => {
    if (!loading && previousReservationsRef.current.length > 0) {
      const newReservations = reservations.filter(reservation => 
        !previousReservationsRef.current.some(prevReservation => prevReservation.id === reservation.id)
      );
      
      newReservations.forEach(reservation => {
        addNotification({
          type: 'reservation',
          title: 'حجز جديد',
          message: `حجز جديد من ${reservation.customerName} لـ ${reservation.guests} أشخاص في ${reservation.date} الساعة ${reservation.time}`,
          data: { reservationId: reservation.id, reservation }
        });
      });
    }
    
    // تحديث المرجع للحجوزات السابقة
    if (!loading) {
      previousReservationsRef.current = [...reservations];
    }
  }, [reservations, loading, addNotification]);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    fetchReservations();
    
    // إعداد polling للتحديث التلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchReservations();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    reservations,
    loading,
    error,
    updateReservationStatus,
    createReservation,
    updateReservation,
    deleteReservation,
    refreshReservations: fetchReservations
  };
};
