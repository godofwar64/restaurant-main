import axios from 'axios';

// تكوين الـ API
const API_BASE_URL = 'http://localhost:8000/api';

// إنشاء instance خاص بـ axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor للتعامل مع التوكين
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

// إضافة interceptor للتعامل مع الاستجابات والأخطاء
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // إزالة التوكين المنتهي الصلاحية
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      // إعادة التوجيه إلى صفحة تسجيل الدخول
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;
