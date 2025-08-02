import React, { useState } from 'react';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotificationContext } from '@/contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications, unseenCount, markAsSeen, markAllAsSeen, clearAllNotifications } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notificationId: string) => {
    markAsSeen(notificationId);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unseenCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unseenCount > 9 ? '9+' : unseenCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {notifications.length > 0 && (
          <>
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold text-sm">الإشعارات</h3>
              <div className="flex gap-1">
                {unseenCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsSeen();
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <CheckCheck className="h-3 w-3 ml-1" />
                    تحديد الكل كمقروء
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllNotifications();
                  }}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 ml-1" />
                  مسح الكل
                </Button>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">لا توجد إشعارات جديدة</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                  !notification.seen ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  !notification.seen ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 text-right min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-600 break-words">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
                <Badge 
                  variant={notification.type === 'order' ? 'default' : 'secondary'}
                  className="text-xs px-1 py-0 h-5"
                >
                  {notification.type === 'order' ? 'طلب' : 'حجز'}
                </Badge>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
