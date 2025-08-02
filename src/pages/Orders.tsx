import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Clock, CheckCircle, Truck, AlertCircle, Package } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoredOrder {
  id: string;
  timestamp: string;
  total: number;
}

interface OrderDetails {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
  status: string;
  payment_status: string;
  customer_info?: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translations } = useLanguage();

  const [storedOrders, setStoredOrders] = useState<StoredOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Load orders from localStorage on component mount
  useEffect(() => {
    loadStoredOrders();
  }, []);

  const loadStoredOrders = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      
      // Clean orders older than 24 hours
      const now = new Date();
      const filteredOrders = orders.filter((orderItem: StoredOrder) => {
        const orderDate = new Date(orderItem.timestamp);
        const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });
      
      // Update localStorage with cleaned orders
      localStorage.setItem('user_orders', JSON.stringify(filteredOrders));
      setStoredOrders(filteredOrders);
      
    } catch (error) {
      console.error('Error loading stored orders:', error);
      setStoredOrders([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'قيد الانتظار';
      case 'preparing':
        return 'قيد التحضير';
      case 'ready':
        return 'في الطريق';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    if (!orderId.trim()) {
      toast({
        title: "Order ID Required",
        description: "Please enter or select an order ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.getOrder(orderId);
      setOrderDetails(order);
      
      toast({
        title: "Order Found!",
        description: `Order #${orderId} details loaded successfully`,
      });
      
    } catch (error) {
      console.error('Fetch order error:', error);
      setOrderDetails(null);
      toast({
        title: "Order Not Found",
        description: "Please check the order ID and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSearchOrderId(orderId);
    fetchOrderDetails(orderId);
  };

  const handleSearchOrder = () => {
    fetchOrderDetails(searchOrderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">طلباتي</h1>
              <p className="text-muted-foreground">تتبع حالة طلباتك</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Selection */}
            <div className="space-y-6">
              {/* Stored Orders */}
              {storedOrders.length > 0 && (
                <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      طلباتك الأخيرة
                    </CardTitle>
                    <CardDescription>
                      اختر من طلباتك المحفوظة (آخر 24 ساعة)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {storedOrders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/10 ${
                          selectedOrderId === order.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleSelectOrder(order.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">#{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.timestamp)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Manual Search */}
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    البحث عن طلب
                  </CardTitle>
                  <CardDescription>
                    أدخل رقم الطلب للبحث عن تفاصيله
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderSearch">رقم الطلب</Label>
                    <Input
                      id="orderSearch"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      placeholder="أدخل رقم الطلب..."
                      className="h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleSearchOrder}
                    disabled={loading || !searchOrderId.trim()}
                    className="w-full h-12"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        جاري البحث...
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        البحث عن الطلب
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* No Orders Message */}
              {storedOrders.length === 0 && (
                <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد طلبات محفوظة</h3>
                    <p className="text-muted-foreground mb-4">
                      لم تقم بإجراء أي طلبات خلال آخر 24 ساعة
                    </p>
                    <Button onClick={() => navigate('/')}>
                      تصفح القائمة
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Order Details */}
            <div>
              {orderDetails ? (
                <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>تفاصيل الطلب #{orderDetails.id}</CardTitle>
                      <Badge className={`px-3 py-1 ${getStatusColor(orderDetails.status)}`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(orderDetails.status)}
                          {getStatusText(orderDetails.status)}
                        </div>
                      </Badge>
                    </div>
                    <CardDescription>
                      تم الطلب في: {formatDate(orderDetails.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer Info */}
                    {orderDetails.customer_info && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">معلومات العميل</h4>
                        <div className="bg-accent/10 p-3 rounded-lg space-y-1">
                          <p><span className="font-medium">الاسم:</span> {orderDetails.customer_info.name}</p>
                          <p><span className="font-medium">الهاتف:</span> {orderDetails.customer_info.phone}</p>
                          {orderDetails.customer_info.email && (
                            <p><span className="font-medium">البريد:</span> {orderDetails.customer_info.email}</p>
                          )}
                          <p><span className="font-medium">العنوان:</span> {orderDetails.customer_info.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">عناصر الطلب</h4>
                      <div className="space-y-2">
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                الكمية: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {orderDetails.special_instructions && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">تعليمات خاصة</h4>
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                          <p className="text-amber-800">{orderDetails.special_instructions}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>المجموع الإجمالي</span>
                      <span className="text-primary">${orderDetails.total_amount.toFixed(2)}</span>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">حالة الدفع:</span>
                      <Badge variant={orderDetails.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {orderDetails.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع'}
                      </Badge>
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">الحالة الحالية</span>
                      </div>
                      <p className="text-blue-700">
                        {orderDetails.status === 'pending' && 'طلبك قيد المراجعة، سيتم البدء في التحضير قريباً'}
                        {orderDetails.status === 'preparing' && 'جاري تحضير طلبك الآن في المطبخ'}
                        {orderDetails.status === 'ready' && 'طلبك في الطريق إليك الآن'}
                        {orderDetails.status === 'delivered' && 'تم توصيل طلبك بنجاح، نشكرك لاختيار مطعمنا'}
                        {orderDetails.status === 'cancelled' && 'تم إلغاء الطلب'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">اختر أو ابحث عن طلب</h3>
                    <p className="text-muted-foreground">
                      اختر طلباً من القائمة أو ابحث برقم الطلب لعرض التفاصيل
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
