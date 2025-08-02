import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Plus, Calendar, ShoppingCart } from 'lucide-react';

const TestNotifications = () => {
  const { addNotification } = useNotificationContext();

  const addTestOrder = () => {
    const customerNames = ['أحمد محمد', 'فاطمة علي', 'محمود سالم', 'نورا حسن', 'عمر خالد'];
    const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomAmount = Math.floor(Math.random() * 200) + 50;
    
    addNotification({
      type: 'order',
      title: 'طلب جديد',
      message: `طلب جديد من ${randomName} بقيمة ${randomAmount} جنيه`,
      data: { 
        orderId: `order_${Date.now()}`,
        customerName: randomName,
        amount: randomAmount
      }
    });
  };

  const addTestReservation = () => {
    const customerNames = ['سارة أحمد', 'يوسف محمد', 'مريم عبدالله', 'خالد إبراهيم', 'هند سامي'];
    const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomGuests = Math.floor(Math.random() * 6) + 2;
    const today = new Date();
    const futureDate = new Date(today.getTime() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000);
    const date = futureDate.toLocaleDateString('ar-EG');
    const time = `${Math.floor(Math.random() * 4) + 18}:${Math.random() > 0.5 ? '00' : '30'}`;
    
    addNotification({
      type: 'reservation',
      title: 'حجز جديد',
      message: `حجز جديد من ${randomName} لـ ${randomGuests} أشخاص في ${date} الساعة ${time}`,
      data: { 
        reservationId: `reservation_${Date.now()}`,
        customerName: randomName,
        guests: randomGuests,
        date,
        time
      }
    });
  };

  return (
    <div></div>
    // <Card className="w-full max-w-md">
    //   <CardHeader>
    //     <CardTitle className="text-center text-lg">اختبار الإشعارات</CardTitle>
    //   </CardHeader>
    //   <CardContent className="space-y-4">
    //     <Button 
    //       onClick={addTestOrder}
    //       className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
    //     >
    //       <ShoppingCart className="h-4 w-4" />
    //       إضافة طلب تجريبي
    //     </Button>
        
    //     <Button 
    //       onClick={addTestReservation}
    //       className="w-full flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
    //     >
    //       <Calendar className="h-4 w-4" />
    //       إضافة حجز تجريبي
    //     </Button>
        
    //     <div className="pt-2 border-t">
    //       <p className="text-xs text-gray-500 text-center">
    //         استخدم هذه الأزرار لاختبار نظام الإشعارات
    //       </p>
    //     </div>
    //   </CardContent>
    // </Card>
  );
};

export default TestNotifications;
