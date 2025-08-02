// هذا الملف أصبح مُستبدلاً بـ NotificationContext
// استخدم useNotificationContext بدلاً من هذا الhook

import { useNotificationContext } from '@/contexts/NotificationContext';

// للتوافق مع النسخة القديمة
export const useNotifications = () => {
  return useNotificationContext();
};

