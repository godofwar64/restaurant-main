import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { orderService, CreateOrderData } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const { translations } = useLanguage();

  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Order Options
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [items.length, navigate, orderSuccess]);

  const finalTotal = total;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { name, phone, address } = customerInfo;
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }

    if (!phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return false;
    }

    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare order data
      const orderData: CreateOrderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: finalTotal,
        customer_info: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || undefined,
          address: customerInfo.address
        },
        special_instructions: specialInstructions || undefined,
        delivery_address: customerInfo.address,
        payment_method: paymentMethod
      };

      // Create order
      const order = await orderService.createGuestOrder(orderData);
      
      // Save order ID to localStorage with timestamp
      const orderRecord = {
        id: order.id,
        timestamp: new Date().toISOString(),
        total: finalTotal
      };
      
      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      existingOrders.push(orderRecord);
      
      // Clean orders older than 24 hours
      const now = new Date();
      const filteredOrders = existingOrders.filter((orderItem: any) => {
        const orderDate = new Date(orderItem.timestamp);
        const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });
      
      localStorage.setItem('user_orders', JSON.stringify(filteredOrders));
      
      setOrderId(order.id);
      setOrderSuccess(true);
      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been received and is being prepared.`,
      });

    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center shadow-xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
                <CardDescription className="text-lg">
                  Thank you for your order. We'll prepare it with care.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-xl font-bold text-primary">#{orderId}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-semibold">احفظ كود الطلبية</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    احفظ رقم الطلب #{orderId} لمتابعة تقدم طلبك. يمكنك استخدام هذا الرقم لتتبع حالة الطلب في أي وقت.
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>30-45 minutes</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full mb-3"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/orders')}
                    className="w-full"
                  >
                    Track Your Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-primary">Checkout</h1>
              <p className="text-muted-foreground">Complete your order details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Customer Info & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact and delivery details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete delivery address..."
                      className="min-h-[100px] resize-none"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold text-sm">$</span>
                            </div>
                            <div>
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Credit/Debit Card</p>
                              <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-bold text-sm">@</span>
                            </div>
                            <div>
                              <p className="font-medium">Online Payment</p>
                              <p className="text-sm text-muted-foreground">Pay via digital wallet</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    Special Instructions
                  </CardTitle>
                  <CardDescription>
                    Any special requests or dietary requirements? (Optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Tell us about any special instructions, allergies, or preferences..."
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    {items.length} item{items.length !== 1 ? 's' : ''} in your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3 p-3 bg-accent/5 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {item.size}
                            </Badge>
                            <span>×{item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">Estimated Delivery</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">30-45 minutes</p>
                  </div>

                  {/* Place Order Button */}
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading || items.length === 0}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order...
                      </div>
                    ) : (
                      `Place Order - $${finalTotal.toFixed(2)}`
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>By placing this order, you agree to our terms and conditions</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
