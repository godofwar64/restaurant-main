import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';
import { useOrders } from '@/hooks/useOrders';
import { useReservations } from '@/hooks/useReservations';
import { MenuItem } from '@/services/menuService';
import { Order } from '@/services/orderService';
import { Reservation } from '@/services/reservationService';
import MenuItemForm from '@/components/MenuItemForm';
import NotificationBell from '@/components/NotificationBell';
import TestNotifications from '@/components/TestNotifications';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AdminFooter from '@/components/AdminFooter';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Users, 
  ShoppingCart, 
  Calendar,
  TrendingUp,
  LogOut,
  BarChart3,
  Clock,
  Star,
  Bell,
  Settings,
  Eye,
  DollarSign,
  Package,
  Plus,
  Upload,
  Check,
  X,
  Home,
  ChefHat,
  Utensils,
  Coffee,
  MenuSquare,
  ImageIcon,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    stats,
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  } = useAdmin();
  
  const {
    orders,
    loading: ordersLoading,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder
  } = useOrders();
  
  const {
    reservations,
    loading: reservationsLoading,
    updateReservationStatus,
    updateReservation,
    deleteReservation
  } = useReservations();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Search and filter states
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('');
  const [menuFilterStatus, setMenuFilterStatus] = useState('');
  
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');
  
  const [reservationSearchTerm, setReservationSearchTerm] = useState('');
  const [reservationFilterStatus, setReservationFilterStatus] = useState('');
  
  // التحقق من صلاحيات الدخول كأدمن
  useEffect(() => {
    const checkAdminAccess = () => {
      if (!authService.isAuthenticated()) {
        navigate('/admin');
        return;
      }
      
      if (!authService.isAdmin()) {
        toast({
          title: "غير مصرح لك بالدخول",
          description: "ليس لديك صلاحية الوصول إلى لوحة الإدارة",
          variant: "destructive",
        });
        navigate('/admin');
        return;
      }
    };
    
    checkAdminAccess();
  }, [navigate, toast]);
  
  // Mock data for orders and reservations (these would come from APIs too)
  // Remove mock data, data will be fetched using hooks
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // Functions using API hooks
  const handleAddMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    setFormLoading(true);
    try {
      await addMenuItem(menuItem);
      setIsAddDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingItem) return;
    
    setFormLoading(true);
    try {
      await updateMenuItem(editingItem.id, menuItem);
      setEditingItem(null);
      setIsEditDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;
    
    try {
      await deleteMenuItem(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    toast({
      title: `تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح!`,
      description: `طلب رقم ${orderId} تم ${action === 'accept' ? 'قبوله' : 'رفضه'}.`,
    });
  };

  const handleReservationAction = (reservationId: number, action: 'accept' | 'reject') => {
    toast({
      title: `تم ${action === 'accept' ? 'قبول' : 'رفض'} الحجز بنجاح!`,
      description: `حجز رقم ${reservationId} تم ${action === 'accept' ? 'قبوله' : 'رفضه'}.`,
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
  };

  // حساب الإيرادات من الطلبات المكتملة
  const calculateRevenue = () => {
    return orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + (order.total_amount || 0), 0);
  };

  // حساب عدد العملاء الفريدين
  const calculateUniqueCustomers = () => {
    const uniqueCustomers = new Set();
    orders.forEach(order => {
      if (order.customer_info?.name && order.customer_info.name !== 'ضيف') {
        uniqueCustomers.add(order.customer_info.name);
      }
      if (order.customer_info?.email) {
        uniqueCustomers.add(order.customer_info.email);
      }
    });
    return uniqueCustomers.size;
  };

  // حساب بيانات آخر 7 أيام للجدول البياني
  const calculateWeeklyData = () => {
    const today = new Date();
    const weekData = [];
    const dayNames = [ 'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      
      // حساب الطلبات لهذا اليوم
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === dateString;
      });
      
      // حساب الحجوزات لهذا اليوم
      const dayReservations = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.created_at);
        return reservationDate.toDateString() === dateString;
      });
      
      // حساب الإيرادات لهذا اليوم (الطلبات المكتملة فقط)
      const dayRevenue = dayOrders
        .filter(order => order.status === 'completed')
        .reduce((total, order) => total + (order.total_amount || 0), 0);
      
      weekData.push({
        day: dayNames[date.getDay()],
        orders: dayOrders.length,
        reservations: dayReservations.length,
        revenue: Math.round(dayRevenue / 100) // تحويل للمئات لسهولة القراءة
      });
    }
    
    return weekData;
  };

  // Filter and search functions
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = menuSearchTerm === '' || 
      item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(menuSearchTerm.toLowerCase());
    
    const matchesCategory = menuFilterCategory === '' || menuFilterCategory === 'all' || item.category === menuFilterCategory;
    
    const matchesStatus = menuFilterStatus === '' || menuFilterStatus === 'all' || 
      (menuFilterStatus === 'available' && item.is_available) ||
      (menuFilterStatus === 'unavailable' && !item.is_available);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = orderSearchTerm === '' ||
      order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (order.customer_info?.name || '').toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (order.customer_info?.phone || '').includes(orderSearchTerm) ||
      (order.customer_info?.email || '').toLowerCase().includes(orderSearchTerm.toLowerCase());
    
    const matchesStatus = orderFilterStatus === '' || orderFilterStatus === 'all' || 
      order.status === orderFilterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservationSearchTerm === '' ||
      reservation.customerName.toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(reservationSearchTerm) ||
      (reservation.customerEmail || '').toLowerCase().includes(reservationSearchTerm.toLowerCase());
    
    const matchesStatus = reservationFilterStatus === '' || reservationFilterStatus === 'all' ||
      (reservationFilterStatus === 'pending' && ['pending', 'قيد الانتظار'].includes(reservation.status)) ||
      (reservationFilterStatus === 'confirmed' && ['confirmed', 'مؤكد'].includes(reservation.status)) ||
      (reservationFilterStatus === 'cancelled' && ['cancelled', 'ملغي'].includes(reservation.status)) ||
      reservation.status === reservationFilterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get unique categories for menu filter
  const menuCategories = [...new Set(menuItems.map(item => item.category))];

  // حساب بيانات الأسبوع للجدول البياني
  const weekData = calculateWeeklyData();
  
  // ترتيب الطلبات حسب التاريخ (الأحدث أولاً) للحصول على آخر 5 طلبات
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 1);
  
  const chartData = {
    labels: weekData.map(d => d.day),
    datasets: [
      {
        label: 'الطلبات',
        data: weekData.map(d => d.orders),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'الحجوزات',
        data: weekData.map(d => d.reservations),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'الإيرادات (بالمئات)',
        data: weekData.map(d => d.revenue),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Arial',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgba(0, 0, 0, 0.6)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl border-l border-gray-200 z-10">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div className="mr-4">
              <h2 className="text-xl font-bold text-gray-800">restaurantFresh</h2>
              <p className="text-sm text-gray-500">لوحة التحكم</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5 ml-3" />
              نظرة عامة
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                activeTab === 'menu' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5 ml-3" />
              إدارة القائمة
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                activeTab === 'orders' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5 ml-3" />
              الطلبات
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                activeTab === 'bookings' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5 ml-3" />
              الحجوزات
            </button>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mr-72 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                مرحباً بك في لوحة التحكم
              </h1>
              <p className="text-gray-600 mt-2 text-lg">إدارة شاملة لمطعمك</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">متصل</span>
              </div>
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                إجمالي الطلبات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {orders.length.toLocaleString()}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% من الأمس
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                العملاء
              </CardTitle>
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {calculateUniqueCustomers()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% من الأمس
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                إجمالي الإيرادات
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {calculateRevenue().toLocaleString()} جنيه
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                الحجوزات الجديدة
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {reservations.length}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% من الأمس
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="menu">إدارة القائمة</TabsTrigger>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Test Notifications - يمكن إزالتها لاحقاً */}
            <div className="mb-6 flex justify-center">
              <TestNotifications />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                    الطلبات الأخيرة
                  </CardTitle>
                  <CardDescription className="text-right" dir="rtl">آخر 4 طلبات تم استلامها</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>لا توجد طلبات حتى الآن</p>
                      </div>
                    ) : (
                      orders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-l from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-800">{order.total_amount} <span className="text-sm font-normal text-gray-600">جنيه</span></p>
                            </div>
                            <Badge 
                              className={
                                order.status === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' : 
                                order.status === 'pending' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                                order.status === 'preparing' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                                order.status === 'on_way' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                                order.status === 'cancelled' ? 'bg-red-500 text-white hover:bg-red-600' :
                                'bg-gray-500 text-white'
                              }
                            >
                              {order.status === 'completed' ? 'تم التسليم' : 
                               order.status === 'pending' ? 'قيد المعالجة' :
                               order.status === 'preparing' ? 'جاري التحضير' :
                               order.status === 'on_way' ? 'في الطريق' :
                               order.status === 'cancelled' ? 'ملغي' : order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-800">{order.customer_info?.name || 'ضيف'}</p>
                              <p className="text-sm text-gray-500"> عنصر {order.items.length} • {new Date(order.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {(order.customer_info?.name || 'ضيف').charAt(0)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {orders.length > 5 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setActiveTab('orders')}
                      >
                        عرض جميع الطلبات ({orders.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    إحصائيات الأسبوع الماضي
                  </CardTitle>
                  <CardDescription>عرض الطلبات، الحجوزات، والإيرادات لآخر 7 أيام</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
                      <div className="text-sm text-blue-600">إجمالي الطلبات</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">{reservations.length}</div>
                      <div className="text-sm text-purple-600">إجمالي الحجوزات</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">{calculateRevenue().toLocaleString()}</div>
                      <div className="text-sm text-yellow-600">الإيرادات (جنيه)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                إضافة طبق جديد
              </Button>
              
              <MenuItemForm
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAddMenuItem}
                loading={formLoading}
              />
              <h2 className="text-2xl font-bold text-right" dir="rtl">إدارة القائمة</h2>
            </div>

            {/* Search and Filter for Menu */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ابحث في الأطباق..."
                      value={menuSearchTerm}
                      onChange={(e) => setMenuSearchTerm(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                  <Select value={menuFilterCategory} onValueChange={setMenuFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفئات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      {menuCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={menuFilterStatus} onValueChange={setMenuFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="available">متوفر</SelectItem>
                      <SelectItem value="unavailable">غير متوفر</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMenuSearchTerm('');
                      setMenuFilterCategory('');
                      setMenuFilterStatus('');
                    }}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة تعيين
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Badge variant="secondary">{filteredMenuItems.length} عنصر</Badge>
                  <span dir="rtl">عناصر القائمة</span>
                </CardTitle>
                <CardDescription>إدارة عناصر القائمة ومتابعة حالتها</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الإجراءات</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">اسم الطبق</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMenuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => setDeleteDialog({ open: true, item })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={item.is_available ? 'default' : 'destructive'}>
                            {item.is_available ? 'متوفر' : 'غير متوفر'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">{item.price} جنيه</TableCell>
                        <TableCell className="text-right">{item.category}</TableCell>
                        <TableCell className="font-medium text-right">{item.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center gap-2 text-right" dir="rtl">
              <h2 className="text-2xl font-bold text-right" dir="rtl">إدارة الطلبات</h2>
            </div>

            {/* Search and Filter for Orders */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ابحث في الطلبات..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                  <Select value={orderFilterStatus} onValueChange={setOrderFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد المعالجة</SelectItem>
                      <SelectItem value="preparing">جاري التحضير</SelectItem>
                      <SelectItem value="on_way">في الطريق</SelectItem>
                      <SelectItem value="completed">تم التوصيل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setOrderSearchTerm('');
                      setOrderFilterStatus('');
                    }}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة تعيين
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Badge variant="secondary">{filteredOrders.length} طلب</Badge>
                  <span dir="rtl">الطلبات الواردة</span>
                </CardTitle>
                <CardDescription>إدارة طلبات العملاء ومتابعة حالتها</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الإجراءات</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الوقت</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">الطلبات</TableHead>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">قيد المعالجة</SelectItem>
                                <SelectItem value="preparing">جاري التحضير</SelectItem>
                                <SelectItem value="on_way">في الطريق</SelectItem>
                                <SelectItem value="completed">تم التوصيل</SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order)
                                setIsOrderDialogOpen(true)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            className={
                              order.status === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' : 
                              order.status === 'pending' ? 'bg-gray-600 text-white hover:bg-gray-700' :
                              order.status === 'preparing' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                              order.status === 'on_way' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                              order.status === 'cancelled' ? 'bg-red-500 text-white hover:bg-red-600' :
                              'bg-gray-500 text-white'
                            }
                          >
                            {order.status === 'completed' ? 'تم التسليم' : 
                             order.status === 'pending' ? 'قيد المعالجة' :
                             order.status === 'preparing' ? 'جاري التحضير' :
                             order.status === 'on_way' ? 'في الطريق' :
                             order.status === 'cancelled' ? 'ملغي' : order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-600">{new Date(order.created_at).toLocaleTimeString('ar-EG')}</TableCell>
                        <TableCell className="text-right font-bold">{order.total_amount} جنيه</TableCell>
                        <TableCell className="text-right max-w-[200px] truncate">{order.items.length} عنصر</TableCell>
                        <TableCell className="font-medium text-right">{order.id}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {order.customer_info?.name || 'ضيف'}
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {(order.customer_info?.name || 'ضيف').charAt(0)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-right" dir="rtl">
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  عرض بالتقويم
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  <Plus className="h-4 w-4" />
                  حجز جديد
                  </Button> */}
              </div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-right" dir="rtl">إدارة الحجوزات</h2>
            </div>

            {/* Search and Filter for Reservations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ابحث في الحجوزات..."
                      value={reservationSearchTerm}
                      onChange={(e) => setReservationSearchTerm(e.target.value)}
                      className="pr-10 text-right"
                    />
                  </div>
                  <Select value={reservationFilterStatus} onValueChange={setReservationFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="confirmed">مؤكد</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setReservationSearchTerm('');
                      setReservationFilterStatus('');
                    }}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة تعيين
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Reservations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Badge variant="secondary">{filteredReservations.length} حجز</Badge>
                    <span dir="rtl">حجوزات اليوم</span>
                  </CardTitle>
                  <CardDescription>إدارة حجوزات الطاولات ومتابعة حالتها</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الإجراءات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الوقت</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">عدد الأشخاص</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Select
                                value={reservation.status}
                                onValueChange={(value) => updateReservationStatus(reservation.id, value)}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                                  <SelectItem value="confirmed">مؤكد</SelectItem>
                                  <SelectItem value="cancelled">ملغي</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedReservation(reservation)
                                  setIsReservationDialogOpen(true)
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={
                                reservation.status === 'confirmed' ? 'default' : 
                                reservation.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {reservation.status === 'confirmed' ? 'مؤكد' : 
                               reservation.status === 'pending' ? 'قيد الانتظار' :
                               reservation.status === 'cancelled' ? 'ملغي' : reservation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{reservation.time}</TableCell>
                          <TableCell className="text-right">{reservation.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Users className="h-4 w-4 text-gray-500" />
                              {reservation.guests}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {reservation.customerName}
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {reservation.customerName.charAt(0)}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
                    إحصائيات سريعة
                    <Calendar className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">حجوزات اليوم</span>
                      <span className="text-2xl font-bold text-blue-800">{reservations.length}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">مؤكدة</span>
                      <span className="text-2xl font-bold text-green-800">
                        {reservations.filter(r => r.status === 'confirmed' || r.status === 'مؤكد').length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-700">في الانتظار</span>
                      <span className="text-2xl font-bold text-yellow-800">
                        {reservations.filter(r => r.status === 'pending' || r.status === 'قيد الانتظار').length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-700">مجموع الضيوف</span>
                      <span className="text-2xl font-bold text-purple-800">
                        {reservations.reduce((total, r) => total + (r.guests || 0), 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Dialog using MenuItemForm */}
      <MenuItemForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditMenuItem}
        editItem={editingItem}
        loading={formLoading}
      />
      
      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              تفاصيل الطلب #{selectedOrder?.id}
            </DialogTitle>
            <DialogDescription className="text-right">
              معلومات مفصلة عن الطلب
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">الاسم:</span>
                    <span>{selectedOrder.customer_info?.name || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الهاتف:</span>
                    <span>{selectedOrder.customer_info?.phone || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <span>{selectedOrder.customer_info?.email || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">العنوان:</span>
                    <span>{selectedOrder.customer_info?.address || 'غير محدد'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">عناصر الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">السعر: {item.price} جنيه</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">الكمية: {item.quantity}</p>
                          <p className="text-sm text-gray-600">المجموع: {item.price * item.quantity} جنيه</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">المجموع الكلي:</span>
                      <span className="text-xl font-bold text-green-600">{selectedOrder.total_amount} جنيه</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">حالة الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">الحالة الحالية:</span>
                    <Badge 
                      className={
                        selectedOrder.status === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' : 
                        selectedOrder.status === 'pending' ? 'bg-gray-600 text-white hover:bg-gray-700' :
                        selectedOrder.status === 'preparing' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                        selectedOrder.status === 'on_way' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                        selectedOrder.status === 'cancelled' ? 'bg-red-500 text-white hover:bg-red-600' :
                        'bg-gray-500 text-white'
                      }
                    >
                      {selectedOrder.status === 'completed' ? 'تم التسليم' : 
                       selectedOrder.status === 'pending' ? 'قيد المعالجة' :
                       selectedOrder.status === 'preparing' ? 'جاري التحضير' : 
                       selectedOrder.status === 'on_way' ? 'في الطريق' :
                       selectedOrder.status === 'cancelled' ? 'ملغي' : selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">حالة الدفع:</span>
                    <Badge variant={selectedOrder.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {selectedOrder.payment_status === 'paid' ? 'مدفوع' : 
                       selectedOrder.payment_status === 'pending' ? 'في الانتظار' : 'غير مدفوع'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">تاريخ الطلب:</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</span>
                  </div>
                  {selectedOrder.special_instructions && (
                    <div className="pt-2">
                      <span className="font-medium block mb-1">تعليمات خاصة:</span>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.special_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reservation Details Dialog */}
      <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              تفاصيل الحجز #{selectedReservation?.id}
            </DialogTitle>
            <DialogDescription className="text-right">
              معلومات مفصلة عن الحجز
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">الاسم:</span>
                    <span>{selectedReservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الهاتف:</span>
                    <span>{selectedReservation.customerPhone}</span>
                  </div>
                  {selectedReservation.customerEmail && (
                    <div className="flex justify-between">
                      <span className="font-medium">البريد الإلكتروني:</span>
                      <span>{selectedReservation.customerEmail}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reservation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تفاصيل الحجز</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">التاريخ:</span>
                    <span>{selectedReservation.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الوقت:</span>
                    <span>{selectedReservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">عدد الأشخاص:</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {selectedReservation.guests}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الحالة:</span>
                    <Badge variant={
                      selectedReservation.status === 'confirmed' ? 'default' : 
                      selectedReservation.status === 'pending' ? 'secondary' : 
                      'destructive'
                    }>
                      {selectedReservation.status === 'confirmed' ? 'مؤكد' : 
                       selectedReservation.status === 'pending' ? 'قيد الانتظار' :
                       selectedReservation.status === 'cancelled' ? 'ملغي' : selectedReservation.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">تاريخ الحجز:</span>
                    <span>{new Date(selectedReservation.created_at).toLocaleString('ar-EG')}</span>
                  </div>
                  {selectedReservation.special_requests && (
                    <div className="pt-2">
                      <span className="font-medium block mb-1">طلبات خاصة:</span>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedReservation.special_requests}</p>
                    </div>
                  )}
                  {selectedReservation.table_preference && (
                    <div className="pt-2">
                      <span className="font-medium block mb-1">تفضيل الطاولة:</span>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedReservation.table_preference}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف طبق "{deleteDialog.item?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف الطبق
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
