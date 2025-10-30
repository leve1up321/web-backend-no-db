// مكون زر الدفع السريع مع Ziina
// Quick Payment Button Component with Ziina Integration

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, CreditCard, Mail, User, Phone, ShoppingCart } from 'lucide-react';
import { useQuickPayment, formatAmount } from '@/hooks/usePayment';
import { toast } from 'sonner';

interface PaymentButtonProps {
  productName: string;
  productId?: string;
  amount: number;
  currency?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCustomerForm?: boolean;
  requiredCustomerInfo?: boolean;
  metadata?: Record<string, any>;
}

/**
 * مكون زر الدفع السريع
 */
export function PaymentButton({
  productName,
  productId,
  amount,
  currency = 'AED',
  description,
  className,
  variant = 'default',
  size = 'default',
  showCustomerForm = true,
  requiredCustomerInfo = false,
  metadata = {}
}: PaymentButtonProps) {
  const { isLoading, error, quickPay } = useQuickPayment();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  /**
   * معالجة النقر على زر الدفع
   */
  const handlePaymentClick = async () => {
    // إذا كانت معلومات العميل مطلوبة ولم يتم ملؤها
    if (requiredCustomerInfo && showCustomerForm && (!customerInfo.email || !customerInfo.name)) {
      setIsDialogOpen(true);
      return;
    }

    await processPayment();
  };

  /**
   * معالجة عملية الدفع
   */
  const processPayment = async () => {
    try {
      const paymentData = {
        productName,
        productId,
        amount,
        description: description || `شراء: ${productName}`,
        customerEmail: customerInfo.email || undefined,
        customerName: customerInfo.name || undefined,
        customerPhone: customerInfo.phone || undefined,
        metadata: {
          source: 'payment_button',
          ...metadata
        }
      };

      const success = await quickPay(paymentData);
      
      if (success) {
        setIsDialogOpen(false);
        // إعادة تعيين النموذج
        setCustomerInfo({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      console.error('خطأ في معالجة الدفع:', err);
      toast.error('فشل في معالجة الدفع');
    }
  };

  /**
   * معالجة تغيير معلومات العميل
   */
  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * التحقق من صحة النموذج
   */
  const isFormValid = () => {
    if (!requiredCustomerInfo) return true;
    return customerInfo.email.trim() !== '' && customerInfo.name.trim() !== '';
  };

  return (
    <>
      {/* زر الدفع الأساسي */}
      <Button
        onClick={handlePaymentClick}
        disabled={isLoading}
        className={className}
        variant={variant}
        size={size}
      >
        {isLoading ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          <>
            <CreditCard className="ml-2 h-4 w-4" />
            اشترِ الآن - {formatAmount(amount, currency)}
          </>
        )}
      </Button>

      {/* نافذة معلومات العميل */}
      {showCustomerForm && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                إتمام عملية الشراء
              </DialogTitle>
              <DialogDescription>
                يرجى ملء معلوماتك لإتمام عملية الشراء
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* تفاصيل المنتج */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{productName}</CardTitle>
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">المبلغ الإجمالي:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(amount, currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* نموذج معلومات العميل */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="customer-name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    الاسم الكامل {requiredCustomerInfo && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="customer-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    required={requiredCustomerInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني {requiredCustomerInfo && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="example@email.com"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    required={requiredCustomerInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    رقم الهاتف (اختياري)
                  </Label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* رسالة خطأ */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={processPayment}
                  disabled={isLoading || !isFormValid()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="ml-2 h-4 w-4" />
                      متابعة الدفع
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
              </div>

              {/* ملاحظة أمان */}
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                🔒 معلوماتك محمية ومشفرة. سيتم توجيهك إلى بوابة الدفع الآمنة.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

/**
 * مكون زر الدفع المبسط (بدون نموذج)
 */
export function SimplePaymentButton({
  productName,
  productId,
  amount,
  currency = 'AED',
  description,
  className,
  variant = 'default',
  size = 'default',
  metadata = {}
}: Omit<PaymentButtonProps, 'showCustomerForm' | 'requiredCustomerInfo'>) {
  return (
    <PaymentButton
      productName={productName}
      productId={productId}
      amount={amount}
      currency={currency}
      description={description}
      className={className}
      variant={variant}
      size={size}
      showCustomerForm={false}
      requiredCustomerInfo={false}
      metadata={metadata}
    />
  );
}

/**
 * مكون زر الدفع مع معلومات العميل المطلوبة
 */
export function PaymentButtonWithCustomerInfo({
  productName,
  productId,
  amount,
  currency = 'AED',
  description,
  className,
  variant = 'default',
  size = 'default',
  metadata = {}
}: Omit<PaymentButtonProps, 'showCustomerForm' | 'requiredCustomerInfo'>) {
  return (
    <PaymentButton
      productName={productName}
      productId={productId}
      amount={amount}
      currency={currency}
      description={description}
      className={className}
      variant={variant}
      size={size}
      showCustomerForm={true}
      requiredCustomerInfo={true}
      metadata={metadata}
    />
  );
}

export default PaymentButton;
