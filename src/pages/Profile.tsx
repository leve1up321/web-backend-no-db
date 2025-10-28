import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Settings, 
  Star, 
  Gift,
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Address } from '@/types/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const profileSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other']),
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'الاسم الأخير مطلوب'),
  company: z.string().optional(),
  address1: z.string().min(5, 'العنوان مطلوب'),
  address2: z.string().optional(),
  city: z.string().min(2, 'المدينة مطلوبة'),
  state: z.string().min(2, 'المنطقة مطلوبة'),
  zipCode: z.string().min(5, 'الرمز البريدي مطلوب'),
  country: z.string().min(2, 'الدولة مطلوبة'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

const Profile = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, isLoading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'home',
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'السعودية',
      phone: '',
      isDefault: false,
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setIsEditingProfile(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await addAddress(data);
      }
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      addressForm.reset();
    } catch (error) {
      // Error handled in context
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      await deleteAddress(id);
    }
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipLabel = (level: string) => {
    switch (level) {
      case 'bronze': return 'برونزي';
      case 'silver': return 'فضي';
      case 'gold': return 'ذهبي';
      case 'platinum': return 'بلاتيني';
      default: return level;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'المنزل';
      case 'work': return 'العمل';
      case 'other': return 'أخرى';
      default: return type;
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>يرجى تسجيل الدخول للوصول إلى الملف الشخصي</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
            <p className="text-gray-600 mt-2">إدارة معلوماتك الشخصية وإعداداتك</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
              <TabsTrigger value="addresses">العناوين</TabsTrigger>
              <TabsTrigger value="loyalty">نقاط الولاء</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>المعلومات الشخصية</CardTitle>
                      <CardDescription>
                        إدارة معلوماتك الأساسية
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingProfile ? 'إلغاء' : 'تعديل'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">الاسم الأول</Label>
                        <Input
                          id="firstName"
                          {...profileForm.register('firstName')}
                          disabled={!isEditingProfile}
                        />
                        {profileForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600">
                            {profileForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">الاسم الأخير</Label>
                        <Input
                          id="lastName"
                          {...profileForm.register('lastName')}
                          disabled={!isEditingProfile}
                        />
                        {profileForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600">
                            {profileForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email')}
                          disabled={!isEditingProfile}
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-red-600">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...profileForm.register('phone')}
                          disabled={!isEditingProfile}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...profileForm.register('dateOfBirth')}
                          disabled={!isEditingProfile}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>مستوى العضوية</Label>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge className={getMembershipColor(user.membershipLevel)}>
                            <Star className="h-3 w-3 mr-1" />
                            {getMembershipLabel(user.membershipLevel)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {user.loyaltyPoints} نقطة
                          </span>
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex justify-end space-x-2 space-x-reverse">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          حفظ التغييرات
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>العناوين المحفوظة</CardTitle>
                      <CardDescription>
                        إدارة عناوين الشحن والفوترة
                      </CardDescription>
                    </div>
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          إضافة عنوان جديد
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
                          </DialogTitle>
                          <DialogDescription>
                            أدخل تفاصيل العنوان الجديد
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="addressType">نوع العنوان</Label>
                            <Select
                              value={addressForm.watch('type')}
                              onValueChange={(value) => addressForm.setValue('type', value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">المنزل</SelectItem>
                                <SelectItem value="work">العمل</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="addressFirstName">الاسم الأول</Label>
                              <Input
                                id="addressFirstName"
                                {...addressForm.register('firstName')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="addressLastName">الاسم الأخير</Label>
                              <Input
                                id="addressLastName"
                                {...addressForm.register('lastName')}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address1">العنوان</Label>
                            <Input
                              id="address1"
                              {...addressForm.register('address1')}
                              placeholder="الشارع والحي"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address2">تفاصيل إضافية (اختياري)</Label>
                            <Input
                              id="address2"
                              {...addressForm.register('address2')}
                              placeholder="رقم الشقة، المبنى، إلخ"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">المدينة</Label>
                              <Input
                                id="city"
                                {...addressForm.register('city')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">المنطقة</Label>
                              <Input
                                id="state"
                                {...addressForm.register('state')}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="zipCode">الرمز البريدي</Label>
                              <Input
                                id="zipCode"
                                {...addressForm.register('zipCode')}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">الدولة</Label>
                              <Input
                                id="country"
                                {...addressForm.register('country')}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 space-x-reverse">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddressDialogOpen(false);
                                setEditingAddress(null);
                                addressForm.reset();
                              }}
                            >
                              إلغاء
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                              {editingAddress ? 'تحديث' : 'إضافة'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد عناوين محفوظة</p>
                        <p className="text-sm text-gray-500">أضف عنوانك الأول لتسهيل عملية الشحن</p>
                      </div>
                    ) : (
                      user.addresses.map((address) => (
                        <Card key={address.id} className={address.isDefault ? 'ring-2 ring-blue-500' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                  {getAddressTypeIcon(address.type)}
                                  <span className="font-medium">
                                    {getAddressTypeLabel(address.type)}
                                  </span>
                                  {address.isDefault && (
                                    <Badge variant="secondary">افتراضي</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.address1}
                                  {address.address2 && `, ${address.address2}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p className="text-sm text-gray-600">{address.country}</p>
                                {address.phone && (
                                  <p className="text-sm text-gray-600">{address.phone}</p>
                                )}
                              </div>
                              <div className="flex space-x-2 space-x-reverse">
                                {!address.isDefault && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDefaultAddress(address.id)}
                                  >
                                    تعيين كافتراضي
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty">
              <Card>
                <CardHeader>
                  <CardTitle>نقاط الولاء</CardTitle>
                  <CardDescription>
                    تتبع نقاطك ومستوى عضويتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
                        <Gift className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">{user.loyaltyPoints} نقطة</h3>
                      <Badge className={`${getMembershipColor(user.membershipLevel)} mt-2`}>
                        <Star className="h-3 w-3 mr-1" />
                        عضو {getMembershipLabel(user.membershipLevel)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-amber-600">برونزي</h4>
                          <p className="text-sm text-gray-600">0 - 499 نقطة</p>
                          <p className="text-xs text-gray-500">خصم 2%</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-gray-600">فضي</h4>
                          <p className="text-sm text-gray-600">500 - 999 نقطة</p>
                          <p className="text-xs text-gray-500">خصم 5%</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="font-semibold text-yellow-600">ذهبي</h4>
                          <p className="text-sm text-gray-600">1000 - 1999 نقطة</p>
                          <p className="text-xs text-gray-500">خصم 8%</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">كيفية كسب النقاط:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 1 نقطة لكل 10 ريال من المشتريات</li>
                        <li>• 50 نقطة إضافية عند كتابة مراجعة</li>
                        <li>• 100 نقطة عند دعوة صديق</li>
                        <li>• نقاط مضاعفة في المناسبات الخاصة</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الحساب</CardTitle>
                  <CardDescription>
                    إدارة تفضيلاتك وإعدادات الإشعارات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">الإشعارات</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">إشعارات البريد الإلكتروني</p>
                            <p className="text-sm text-gray-600">تلقي العروض والتحديثات</p>
                          </div>
                          <Switch
                            checked={user.preferences.notifications.email}
                            onCheckedChange={(checked) => 
                              updateProfile({
                                preferences: {
                                  ...user.preferences,
                                  notifications: {
                                    ...user.preferences.notifications,
                                    email: checked
                                  }
                                }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">إشعارات الرسائل النصية</p>
                            <p className="text-sm text-gray-600">تحديثات الطلبات والشحن</p>
                          </div>
                          <Switch
                            checked={user.preferences.notifications.sms}
                            onCheckedChange={(checked) => 
                              updateProfile({
                                preferences: {
                                  ...user.preferences,
                                  notifications: {
                                    ...user.preferences.notifications,
                                    sms: checked
                                  }
                                }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">التفضيلات</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>اللغة</Label>
                          <Select
                            value={user.preferences.language}
                            onValueChange={(value) => 
                              updateProfile({
                                preferences: {
                                  ...user.preferences,
                                  language: value
                                }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ar">العربية</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>العملة</Label>
                          <Select
                            value={user.preferences.currency}
                            onValueChange={(value) => 
                              updateProfile({
                                preferences: {
                                  ...user.preferences,
                                  currency: value
                                }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SAR">ريال سعودي</SelectItem>
                              <SelectItem value="USD">دولار أمريكي</SelectItem>
                              <SelectItem value="EUR">يورو</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
