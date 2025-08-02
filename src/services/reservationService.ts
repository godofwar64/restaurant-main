import api from '../config/api';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  table_preference?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
  table_preference?: string;
}

class ReservationService {
  // إنشاء حجز جديد
  async createReservation(reservationData: CreateReservationData): Promise<Reservation> {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('Create reservation error:', error);
      throw error;
    }
  }

  // الحصول على جميع الحجوزات (للإدارة)
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get('/reservations');
      return response.data;
    } catch (error) {
      console.error('Get all reservations error:', error);
      throw error;
    }
  }

  // الحصول على حجز محدد
  async getReservation(reservationId: string): Promise<Reservation> {
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Get reservation error:', error);
      throw error;
    }
  }

  // تحديث حجز
  async updateReservation(reservationId: string, updates: Partial<Reservation>): Promise<Reservation> {
    try {
      const response = await api.put(`/reservations/${reservationId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update reservation error:', error);
      throw error;
    }
  }

  // تحديث حالة الحجز
  async updateReservationStatus(reservationId: string, status: string): Promise<Reservation> {
    try {
      const response = await api.put(`/reservations/${reservationId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update reservation status error:', error);
      throw error;
    }
  }

  // حذف حجز
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      await api.delete(`/reservations/${reservationId}`);
    } catch (error) {
      console.error('Delete reservation error:', error);
      throw error;
    }
  }

  // الحصول على إحصائيات الحجوزات
  async getReservationStats(): Promise<any> {
    try {
      const response = await api.get('/reservations/stats');
      return response.data;
    } catch (error) {
      console.error('Get reservation stats error:', error);
      throw error;
    }
  }

  // الحصول على الحجوزات لتاريخ معين
  async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      const response = await api.get(`/reservations/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Get reservations by date error:', error);
      throw error;
    }
  }
}

export const reservationService = new ReservationService();
export default reservationService;
