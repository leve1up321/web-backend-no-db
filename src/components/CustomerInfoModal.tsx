import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
  isLoading?: boolean;
}

const CustomerInfoModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: CustomerInfoModalProps) => {
  const { t, language } = useLanguage();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // تحميل البيانات المحفوظة عند فتح النموذج
  useEffect(() => {
    if (isOpen) {
      const savedInfo = localStorage.getItem('levelup-customer-info');
      if (savedInfo) {
        try {
          const parsed = JSON.parse(savedInfo);
          setCustomerInfo(parsed);
        } catch (error) {
          console.error('Error loading saved customer info:', error);
        }
      }
    }
  }, [isOpen]);

  // حفظ البيانات في localStorage عند التغيير
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    const newInfo = { ...customerInfo, [field]: value };
    setCustomerInfo(newInfo);
    
    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // حفظ في localStorage
    localStorage.setItem('levelup-customer-info', JSON.stringify(newInfo));
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(customerInfo);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {language === 'ar' ? 'بيانات العميل' : 'Customer Information'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
              className={errors.email ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* رقم الهاتف (اختياري) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              <span className="text-sm text-muted-foreground">
                ({language === 'ar' ? 'اختياري' : 'Optional'})
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={language === 'ar' ? '+971 50 123 4567' : '+971 50 123 4567'}
              disabled={isLoading}
            />
          </div>

          {/* العنوان (اختياري) */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {language === 'ar' ? 'العنوان' : 'Address'}
              <span className="text-sm text-muted-foreground">
                ({language === 'ar' ? 'اختياري' : 'Optional'})
              </span>
            </Label>
            <Input
              id="address"
              type="text"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={language === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, UAE'}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {isLoading 
                ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                : (language === 'ar' ? 'متابعة الدفع' : 'Continue to Payment')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerInfoModal;
