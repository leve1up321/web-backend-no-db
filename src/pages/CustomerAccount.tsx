import React, { useState } from 'react';
import { User, Package, Settings, CreditCard, Star, Clock, CheckCircle, XCircle, Eye, Download, MessageSquare, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  productName: string;
  price: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  downloadLink?: string;
}

interface Review {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  canEdit: boolean;
}

const CustomerAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reviews' | 'settings'>('profile');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>('');

  // Mock data
  const customerData = {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+971501234567',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 2450
  };

  const orders: Order[] = [
    {
      id: 'ORD-001',
      productName: 'PlayStation Plus Premium - 12 شهر',
      price: 299,
      status: 'completed',
      date: '2024-10-25',
      downloadLink: '#'
    },
    {
      id: 'ORD-002',
      productName: 'Netflix Premium - 6 أشهر',
      price: 180,
      status: 'pending',
      date: '2024-10-28'
    },
    {
      id: 'ORD-003',
      productName: 'Steam Wallet - 100$',
      price: 367,
      status: 'completed',
      date: '2024-10-20',
      downloadLink: '#'
    }
  ];

  const reviews: Review[] = [
    {
      id: 'REV-001',
      productName: 'PlayStation Plus Premium - 12 شهر',
      rating: 5,
      comment: 'خدمة ممتازة وسريعة، تم التفعيل فوراً',
      date: '2024-10-26',
      canEdit: true
    },
    {
      id: 'REV-002',
      productName: 'Steam Wallet - 100$',
      rating: 4,
      comment: 'جيد جداً، لكن التسليم تأخر قليلاً',
      date: '2024-10-21',
      canEdit: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المعالجة';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveReview = (reviewId: string) => {
    // Here you would typically make an API call to update the review
    console.log('Saving review:', { reviewId, rating: editRating, comment: editComment });
    setEditingReview(null);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">حسابي</h1>
            <p className="text-xl opacity-90">
              إدارة حسابك وطلباتك وتقييماتك
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ArrowRight className="h-4 w-4" />
              <span>حسابي</span>
            </div>
            <Link to="/">
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </button>
            </Link>
          </div>

          {/* Demo Data Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 text-white rounded-full p-2">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">📊 بيانات تجريبية للعرض</h3>
                <p className="text-sm text-amber-700">
                  البيانات المعروضة هنا هي أمثلة توضيحية. لجعل الصفحة تعمل بشكل فعلي، تحتاج إلى نظام تسجيل دخول وقاعدة بيانات.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="bg-primary/10 rounded-full p-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{customerData.name}</h2>
                <p className="text-muted-foreground mb-1">{customerData.email}</p>
                <p className="text-sm text-muted-foreground">عضو منذ {customerData.joinDate}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{customerData.totalOrders}</div>
                <div className="text-sm text-muted-foreground">إجمالي الطلبات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{customerData.totalSpent} درهم</div>
                <div className="text-sm text-muted-foreground">إجمالي المشتريات</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card rounded-lg shadow-lg mb-8">
            <div className="border-b border-border">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User className="h-5 w-5" />
                  الملف الشخصي
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  طلباتي
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Star className="h-5 w-5" />
                  تقييماتي
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  الإعدادات
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">المعلومات الشخصية</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">الاسم الكامل</label>
                      <input
                        type="text"
                        value={customerData.name}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={customerData.email}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">تاريخ الانضمام</label>
                      <input
                        type="text"
                        value={customerData.joinDate}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-muted"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">طلباتي</h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <h4 className="font-semibold text-foreground">{order.productName}</h4>
                              <p className="text-sm text-muted-foreground">رقم الطلب: {order.id}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-bold text-primary">{order.price} درهم</div>
                            <div className="text-sm text-muted-foreground">{order.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">الحالة:</span>
                            <span className={`text-sm font-medium ${
                              order.status === 'completed' ? 'text-green-600' :
                              order.status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </button>
                            {order.downloadLink && order.status === 'completed' && (
                              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                <Download className="h-4 w-4" />
                                تحميل
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">تقييماتي</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">{review.productName}</h4>
                            {editingReview === review.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">التقييم</label>
                                  {renderStars(editRating, true, setEditRating)}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">التعليق</label>
                                  <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    rows={3}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveReview(review.id)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                  >
                                    حفظ
                                  </button>
                                  <button
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                {renderStars(review.rating)}
                                <p className="text-muted-foreground mt-2">{review.comment}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-sm text-muted-foreground mb-2">{review.date}</div>
                            {review.canEdit && editingReview !== review.id && (
                              <button
                                onClick={() => handleEditReview(review)}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                              >
                                <MessageSquare className="h-4 w-4" />
                                تعديل
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">إعدادات الحساب</h3>
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-foreground mb-4">تغيير كلمة المرور</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">كلمة المرور الحالية</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">تأكيد كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          تحديث كلمة المرور
                        </button>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-foreground mb-4">إعدادات الإشعارات</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">إشعارات الطلبات</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">إشعارات العروض</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">إشعارات المنتجات الجديدة</span>
                          <input type="checkbox" className="toggle" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How to Make it Real Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🔧 كيفية جعل هذه الصفحة تعمل بشكل فعلي:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🔐 نظام المصادقة (Authentication):</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• تسجيل دخول وإنشاء حساب</li>
                  <li>• التحقق من الهوية</li>
                  <li>• إدارة الجلسات</li>
                  <li>• استرجاع كلمة المرور</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🗄️ قاعدة البيانات:</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• حفظ بيانات المستخدمين</li>
                  <li>• تخزين الطلبات والمشتريات</li>
                  <li>• حفظ التقييمات والمراجعات</li>
                  <li>• إدارة المنتجات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🛒 نظام الطلبات:</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• ربط مع نظام الدفع</li>
                  <li>• تتبع حالة الطلبات</li>
                  <li>• إشعارات الطلبات</li>
                  <li>• تاريخ المشتريات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">📱 API والخادم:</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• خادم Backend (Node.js/PHP)</li>
                  <li>• APIs للتواصل</li>
                  <li>• أمان البيانات</li>
                  <li>• النسخ الاحتياطي</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💡 ملاحظة:</strong> الصفحة الحالية تعرض كيف ستبدو واجهة المستخدم عند وجود هذه الأنظمة. 
                البيانات المعروضة (أحمد، 2000 درهم، الطلبات) هي أمثلة توضيحية فقط.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
