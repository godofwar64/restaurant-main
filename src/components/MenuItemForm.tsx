import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { MenuItem, menuService } from '@/services/menuService';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editItem?: MenuItem | null;
  loading?: boolean;
}

const MenuItemForm = ({ open, onOpenChange, onSubmit, editItem, loading = false }: MenuItemFormProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    image_url: string;
    is_available: boolean;
    allergens: string;
    preparation_time: string;
    prices: { [key: string]: string };
    popular: boolean;
    hasSizes: boolean;
  }>({
    name: editItem?.name || '',
    description: editItem?.description || '',
    price: editItem?.price?.toString() || '',
    category: editItem?.category || '',
    image_url: editItem?.image_url || '',
    is_available: editItem?.is_available ?? true,
    allergens: editItem?.allergens?.join(', ') || '',
    preparation_time: editItem?.preparation_time?.toString() || '15',
    prices: {
      small: editItem?.prices?.small?.toString() || '',
      medium: editItem?.prices?.medium?.toString() || '',
      large: editItem?.prices?.large?.toString() || ''
    },
    popular: editItem?.popular || false,
    hasSizes: editItem?.prices && Object.keys(editItem.prices).length > 0
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(editItem?.image_url || null);
  const [loadingData, setLoadingData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // جلب البيانات الكاملة عند فتح التعديل
  useEffect(() => {
    const fetchItemData = async () => {
      if (editItem && open) {
        setLoadingData(true);
        try {
          const fullItemData = await menuService.getMenuItem(editItem.id);
          setFormData({
            name: fullItemData.name || '',
            description: fullItemData.description || '',
            price: fullItemData.price?.toString() || '',
            category: fullItemData.category || '',
            image_url: fullItemData.image_url || '',
            is_available: fullItemData.is_available ?? true,
            allergens: fullItemData.allergens?.join(', ') || '',
            preparation_time: fullItemData.preparation_time?.toString() || '15',
            prices: {
              small: fullItemData.prices?.small?.toString() || '',
              medium: fullItemData.prices?.medium?.toString() || '',
              large: fullItemData.prices?.large?.toString() || ''
            },
            popular: fullItemData.popular || false,
            hasSizes: fullItemData.prices && Object.keys(fullItemData.prices).length > 0
          });
          setImagePreview(fullItemData.image_url || null);
        } catch (error) {
          console.error('Error fetching item data:', error);
          toast({
            title: "خطأ في جلب البيانات",
            description: "حدث خطأ أثناء جلب بيانات الطبق",
            variant: "destructive",
          });
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchItemData();
  }, [editItem, open, toast]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "نوع الملف غير مدعوم",
        description: "يرجى اختيار صورة بصيغة JPEG, PNG, JPG أو WebP",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('فشل في رفع الصورة');
      }

      const result = await response.json();
      
      setFormData(prev => ({ ...prev, image_url: result.image_url }));
      setImagePreview(result.image_url);
      
      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم حفظ الصورة وإضافتها للطبق",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuItem = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image_url: formData.image_url,
      is_available: formData.is_available,
      allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
      preparation_time: parseInt(formData.preparation_time) || 15,
      popular: formData.popular,
      prices: formData.hasSizes ? {
        ...(formData.prices.small && { small: parseFloat(formData.prices.small) }),
        ...(formData.prices.medium && { medium: parseFloat(formData.prices.medium) }),
        ...(formData.prices.large && { large: parseFloat(formData.prices.large) })
      } : {}
    };

    try {
      await onSubmit(menuItem);
      onOpenChange(false);
      // Reset form
      setFormData({
        name: '', description: '', price: '', category: '', image_url: '',
        is_available: true, allergens: '', preparation_time: '15',
        prices: { small: '', medium: '', large: '' },
        popular: false,
        hasSizes: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {editItem ? 'Update the menu item details below.' : 'Fill in the details for the new menu item.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish..."
              className="min-h-[80px]"
            />
          </div>

          {/* Pricing */}
          <div>
            <Label>Pricing</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <Label htmlFor="base-price" className="text-sm">Base Price *</Label>
                <Input
                  id="base-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="small-price" className="text-sm">Small Size</Label>
                <Input
                  id="small-price"
                  type="number"
                  step="0.01"
                  value={formData.prices.small}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    prices: { ...formData.prices, small: e.target.value }
                  })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="medium-price" className="text-sm">Medium Size</Label>
                <Input
                  id="medium-price"
                  type="number"
                  step="0.01"
                  value={formData.prices.medium}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    prices: { ...formData.prices, medium: e.target.value }
                  })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="large-price" className="text-sm">Large Size</Label>
                <Input
                  id="large-price"
                  type="number"
                  step="0.01"
                  value={formData.prices.large}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    prices: { ...formData.prices, large: e.target.value }
                  })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>صورة الطبق</Label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="معاينة الصورة" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            {/* Manual URL Input */}
            <div>
              <Label htmlFor="image-url">أو أدخل رابط الصورة</Label>
              <Input
                id="image-url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreview(e.target.value || null);
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prep-time">وقت التحضير (بالدقائق)</Label>
              <Input
                id="prep-time"
                type="number"
                value={formData.preparation_time}
                onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="allergens">مسببات الحساسية (مفصولة بفواصل)</Label>
              <Input
                id="allergens"
                value={formData.allergens}
                onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                placeholder="مكسرات، ألبان، جلوتين"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
              />
              <Label htmlFor="available">متاح للطلب</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
              />
              <Label htmlFor="popular">طبق مشهور</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hasSizes"
                checked={formData.hasSizes}
                onCheckedChange={(checked) => setFormData({ ...formData, hasSizes: checked })}
              />
              <Label htmlFor="hasSizes">يتوفر بأحجام مختلفة</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (editItem ? 'Update Item' : 'Add Item')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemForm;
