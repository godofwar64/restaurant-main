import api from '../config/api';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  allergens?: string[];
  preparation_time: number;
  prices?: { [key: string]: number };
  popular?: boolean;
  created_at: string;
  updated_at: string;
}

class MenuService {
  // الحصول على جميع المأكولات
  async getMenu(category?: string, availableOnly: boolean = true): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('available_only', availableOnly.toString());
      
      const response = await api.get(`/menu/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get menu error:', error);
      throw error;
    }
  }

  // الحصول على طبق واحد بواسطة الـ ID
  async getMenuItem(itemId: string): Promise<MenuItem> {
    try {
      const response = await api.get(`/menu/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Get menu item error:', error);
      throw error;
    }
  }

  // الحصول على الفئات المتاحة
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/menu/categories/list');
      return response.data.categories;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // إنشاء طبق جديد (للأدمن فقط)
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    try {
      const response = await api.post('/menu', menuItem);
      return response.data;
    } catch (error) {
      console.error('Create menu item error:', error);
      throw error;
    }
  }

  // تحديث طبق (للأدمن فقط)
  async updateMenuItem(itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await api.put(`/menu/${itemId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update menu item error:', error);
      throw error;
    }
  }

  // حذف طبق (للأدمن فقط)
  async deleteMenuItem(itemId: string): Promise<void> {
    try {
      await api.delete(`/menu/${itemId}`);
    } catch (error) {
      console.error('Delete menu item error:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
export default menuService;
