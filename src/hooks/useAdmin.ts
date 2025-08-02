import { useState, useEffect } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import { menuService, MenuItem } from '@/services/menuService';
import { useToast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // جلب إحصائيات لوحة التحكم
  const fetchDashboardStats = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    }
  };

  // جلب عناصر القائمة
  const fetchMenuItems = async () => {
    try {
      const items = await adminService.getAllMenuItems();
      setMenuItems(items);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items');
    }
  };

  // إضافة عنصر جديد للقائمة
  const addMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await adminService.addMenuItem(menuItem);
      setMenuItems(prev => [...prev, newItem]);
      toast({
        title: "Menu item added successfully!",
        description: `${menuItem.name} has been added to the menu.`,
      });
      return newItem;
    } catch (err) {
      console.error('Error adding menu item:', err);
      toast({
        title: "Failed to add menu item",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // تحديث عنصر في القائمة
  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      const updatedItem = await adminService.updateMenuItem(itemId, updates);
      setMenuItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      toast({
        title: "Menu item updated successfully!",
        description: "The changes have been saved.",
      });
      return updatedItem;
    } catch (err) {
      console.error('Error updating menu item:', err);
      toast({
        title: "Failed to update menu item",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // حذف عنصر من القائمة
  const deleteMenuItem = async (itemId: string) => {
    try {
      await adminService.deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Menu item deleted successfully!",
        description: "The item has been removed from the menu.",
      });
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast({
        title: "Failed to delete menu item",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchMenuItems()
        ]);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    stats,
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refreshStats: fetchDashboardStats,
    refreshMenuItems: fetchMenuItems
  };
};
