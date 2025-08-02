import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// إنشاء axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة التوكين للطلبات
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة الاستجابات والأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إزالة التوكين المنتهي الصلاحية
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  role: string;
}

class AuthService {
  // تسجيل الدخول
  async login(credentials: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
      // حفظ البيانات في localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify({
        user_id: data.user_id,
        role: data.role
      }));
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // تسجيل الخروج
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  // التحقق من تسجيل الدخول
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // التحقق من دور المستخدم
  isAdmin(): boolean {
    const userData = localStorage.getItem('user_data');
    if (!userData) return false;
    
    try {
      const parsed = JSON.parse(userData);
      return parsed.role === 'admin';
    } catch {
      return false;
    }
  }

  // الحصول على التوكين
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // الحصول على بيانات المستخدم
  getUserData(): { user_id: string; role: string } | null {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
