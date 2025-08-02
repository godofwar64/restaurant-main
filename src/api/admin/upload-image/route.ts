import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // التحقق من صلاحيات الإدارة
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token || !authService.verifyToken(token) || !authService.isAdmin()) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'لم يتم إرفاق ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'نوع الملف غير مدعوم. يرجى استخدام JPEG, PNG, JPG أو WebP' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'حجم الملف كبير جداً. يجب أن يكون أقل من 5 ميجابايت' },
        { status: 400 }
      );
    }

    // إنشاء مجلد الصور إذا لم يكن موجوداً
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'menu-images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // إنشاء اسم فريد للملف
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.type.split('/')[1]}`;
    const filePath = path.join(uploadsDir, fileName);

    // حفظ الملف
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // إرجاع رابط الصورة
    const imageUrl = `/uploads/menu-images/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      image_url: imageUrl,
      filename: fileName
    });

  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    );
  }
}
