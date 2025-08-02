import { NextRequest, NextResponse } from 'next/server';
const config = require('../../config/config');

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'التوكن مطلوب' }, { status: 401 });
    }

    const response = await fetch(`${config.MAIN_API_BASE_URL}/groups/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: `فشل جلب المجموعات: ${errorText || 'خطأ غير معروف'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: `خطأ في جلب المجموعات: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'التوكن مطلوب' }, { status: 401 });
    }

    const body = await req.json();
    const response = await fetch(`${config.MAIN_API_BASE_URL}/groups/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: `فشل إنشاء المجموعة: ${errorText || 'خطأ غير معروف'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: `خطأ في إنشاء المجموعة: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'التوكن مطلوب' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
    }

    const response = await fetch(`${config.MAIN_API_BASE_URL}/groups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: `فشل تحديث المجموعة: ${errorText || 'خطأ غير معروف'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { error: `خطأ في تحديث المجموعة: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'التوكن مطلوب' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
    }

    const response = await fetch(`${config.MAIN_API_BASE_URL}/groups/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: `فشل حذف المجموعة: ${errorText || 'خطأ غير معروف'}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'تم حذف المجموعة بنجاح' });
  } catch (error: any) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: `خطأ في حذف المجموعة: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'التوكن مطلوب' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    const studentId = searchParams.get('studentId');
    const action = searchParams.get('action');
    
    if (!groupId) {
      return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
    }

    if (action === 'add-student') {
      if (!studentId) {
        return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
      }
      
      console.log('Adding student to group:', { groupId, studentId });
      
      const response = await fetch(`${config.MAIN_API_BASE_URL}/groups/${groupId}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: studentId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('External API error:', errorText);
        return NextResponse.json(
          { error: `فشل إضافة الطالب للمجموعة: ${errorText || 'خطأ غير معروف'}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'عملية غير مدعومة' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in PATCH operation:', error);
    return NextResponse.json(
      { error: `خطأ في العملية: ${error.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

