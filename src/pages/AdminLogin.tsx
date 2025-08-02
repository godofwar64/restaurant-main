import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import AdminFooter from '@/components/AdminFooter';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('محاولة تسجيل الدخول بالبيانات:', { email, password });
      
      const response = await authService.login({ email, password });
      
      console.log('استجابة تسجيل الدخول:', response);

      if (response.role === 'admin') {
        toast({
          title: "مرحباً بك!",
          description: "تم تسجيل الدخول بنجاح",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      let errorMessage = "حدث خطأ في تسجيل الدخول";
      
      if (error.response?.status === 401) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: "فشل تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                لوحة الإدارة
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                تسجيل دخول المشرف
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block font-medium text-gray-700">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-right bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block font-medium text-gray-700">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-right bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 pl-12"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-5 h-5 ml-2" />
                    تسجيل الدخول
                  </div>
                )}
              </Button>
            </form>
            
            {/* معلومات تجريبية */}
            {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2 text-right">
                بيانات تجريبية:
              </h4>
              <div className="text-sm text-blue-700 space-y-1 text-right">
                <p>البريد الإلكتروني: admin@restauranrfresh.com</p>
                <p>كلمة المرور: admin123</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLogin;
