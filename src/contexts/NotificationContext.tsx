import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'order' | 'reservation';
  message: string;
  title: string;
  seen: boolean;
  createdAt: Date;
  data?: any; // بيانات إضافية حسب نوع الإشعار
}

interface NotificationContextType {
  notifications: Notification[];
  unseenCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'seen' | 'createdAt'>) => void;
  markAsSeen: (notificationId: string) => void;
  markAllAsSeen: () => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // إضافة إشعار جديد
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'seen' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      seen: false,
      createdAt: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // عرض إشعار متصفح إذا كانت الصفحة غير نشطة
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        tag: newNotification.id,
      });
    }
  }, []);

  // تحديد إشعار كمقروء
  const markAsSeen = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, seen: true }
          : notification
      )
    );
  }, []);

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsSeen = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, seen: true }))
    );
  }, []);

  // مسح جميع الإشعارات
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // طلب إذن الإشعارات عند تحميل المكون
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // حساب عدد الإشعارات غير المقروءة
  const unseenCount = notifications.filter(notification => !notification.seen).length;

  const contextValue: NotificationContextType = {
    notifications,
    unseenCount,
    addNotification,
    markAsSeen,
    markAllAsSeen,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
