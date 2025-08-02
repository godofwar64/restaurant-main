# 🍽️ نظام إدارة المطاعم - Restaurant Management System

## نظرة عامة

نظام شامل لإدارة المطاعم يتكون من واجهة عملاء متطورة ولوحة تحكم إدارية متكاملة.

## ✨ المميزات الرئيسية

### للعملاء:
- 🏠 **الصفحة الرئيسية**: عرض جذاب للمطعم والأطباق الشائعة
- 🍴 **قوائم الطعام**: تصفح الأطباق حسب الفئات (إفطار، غداء، عشاء، حلويات)
- 🛒 **نظام السلة**: إضافة وتعديل الطلبات بسهولة
- 💳 **صفحة الدفع**: نظام دفع متكامل مع خيارات متعددة
- 📦 **تتبع الطلبات**: متابعة حالة الطلب في الوقت الفعلي
- 📅 **حجز الطاولات**: نظام حجز سهل ومرن
- 🌐 **دعم ثنائي اللغة**: العربية والإنجليزية
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة

### لوحة الإدارة:
- 📊 **لوحة تحكم شاملة**: إحصائيات وتحليلات مفصلة
- 🍽️ **إدارة القائمة**: إضافة وتعديل وحذف الأطباق
- 📋 **إدارة الطلبات**: متابعة وتحديث حالة الطلبات
- 🎯 **إدارة الحجوزات**: إدارة حجوزات الطاولات
- 👥 **إدارة العملاء**: قاعدة بيانات العملاء
- 📈 **التقارير والإحصائيات**: رسوم بيانية تفاعلية

## 🛠️ التقنيات المستخدمة

### Frontend (واجهة المستخدم):
- **React 18** + **TypeScript**
- **Vite** (أداة البناء)
- **Tailwind CSS** (التصميم)
- **shadcn/ui** (مكونات الواجهة)
- **Lucide React** (الأيقونات)
- **React Router** (التنقل)
- **Chart.js** (الرسوم البيانية)
- **React Hook Form** (إدارة النماذج)
- **Axios** (HTTP requests)

### Backend (الخادم):
- **FastAPI** (Python)
- **MongoDB** (قاعدة البيانات)
- **Motor** (MongoDB async driver)
- **JWT** (المصادقة)
- **Pydantic** (التحقق من البيانات)

## 🚀 التشغيل السريع

### متطلبات النظام:
- Node.js 18+ & npm
- Python 3.9+
- MongoDB

### تشغيل المشروع:

#### 1. Frontend (React):
```bash
cd restaurant-menu
npm install
npm run dev
```
التطبيق سيعمل على: `http://localhost:5173`

#### 2. Backend (FastAPI):
```bash
cd restaurant-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API سيعمل على: `http://localhost:8000`

### إعداد قاعدة البيانات:
```bash
# تشغيل MongoDB
mongod --dbpath /path/to/your/db
```

## 📁 هيكل المشروع

```
restaurant/
├── restaurant-menu/          # Frontend (React)
│   ├── src/
│   │   ├── components/       # مكونات الواجهة
│   │   ├── pages/           # صفحات التطبيق
│   │   ├── services/        # خدمات API
│   │   ├── hooks/           # React hooks
│   │   ├── contexts/        # React contexts
│   │   ├── translations/    # ملفات الترجمة
│   │   └── config/          # إعدادات التطبيق
│   └── public/              # الملفات العامة
├── restaurant-api/          # Backend (FastAPI)
│   ├── app/
│   │   ├── models/          # نماذج البيانات
│   │   ├── routes/          # مسارات API
│   │   ├── services/        # خدمات الأعمال
│   │   └── core/            # إعدادات أساسية
│   └── requirements.txt     # متطلبات Python
└── API_DOCUMENTATION.md     # وثائق API
```

## 🔧 الإعدادات

### متغيرات البيئة:

#### Frontend (.env):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### Backend (.env):
```env
DATABASE_URL=mongodb://localhost:27017/restaurant
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📚 الوثائق

- **[وثائق API](../API_DOCUMENTATION.md)**: دليل شامل لجميع endpoints
- **[نظام الطلبات](./CHECKOUT_README.md)**: شرح مفصل لنظام الطلبات والدفع
- **Swagger UI**: `http://localhost:8000/docs` (مع تشغيل الخادم)

## 🎨 واجهات المستخدم

### للعملاء:
- `/` - الصفحة الرئيسية
- `/breakfast` - قائمة الإفطار
- `/lunch` - قائمة الغداء
- `/dinner` - قائمة العشاء
- `/dessert` - قائمة الحلويات
- `/booking` - حجز الطاولات
- `/checkout` - إتمام الطلب
- `/orders` - تتبع الطلبات

### لوحة الإدارة:
- `/admin` - تسجيل دخول الإدارة
- `/admin/dashboard` - لوحة التحكم الرئيسية

## 🔐 المصادقة والأمان

- **JWT Tokens**: للمصادقة الآمنة
- **Protected Routes**: حماية صفحات الإدارة
- **Data Validation**: التحقق من البيانات
- **CORS**: إعدادات الأمان للطلبات

## 📱 الميزات التقنية

- ✅ **تصميم متجاوب** (Mobile-first)
- ✅ **PWA Ready** (Progressive Web App)
- ✅ **TypeScript** (Type Safety)
- ✅ **Real-time Updates** (تحديثات فورية)
- ✅ **Error Handling** (معالجة الأخطاء)
- ✅ **Loading States** (حالات التحميل)
- ✅ **Form Validation** (التحقق من النماذج)
- ✅ **Local Storage** (التخزين المحلي)

## 🌍 دعم اللغات

التطبيق يدعم:
- 🇸🇦 العربية (RTL)
- 🇺🇸 الإنجليزية (LTR)

## 🚀 النشر والتطوير

### البناء للإنتاج:
```bash
# Frontend
npm run build

# Backend
# FastAPI يعمل مع uvicorn في الإنتاج
```

### اختبار التطبيق:
```bash
# Frontend
npm run test

# Backend
pytest
```

## 👨‍💻 المطور

**Essam Abo Elmgd**  
Full Stack Developer

📞 للتواصل والدعم: [WhatsApp](https://wa.me/201062772291)

---

## 📄 الرخصة

هذا المشروع محمي بحقوق الطبع والنشر © 2025 Essam Abo Elmgd

---

**آخر تحديث:** 2025-01-02  
**إصدار:** 1.0.0
