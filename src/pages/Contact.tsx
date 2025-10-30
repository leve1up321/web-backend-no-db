import React from 'react';
import { ArrowRight, Mail, Phone, MessageCircle, Instagram, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      title: 'واتساب',
      description: 'تواصل معنا مباشرة عبر الواتساب',
      icon: MessageCircle,
      link: 'https://wa.me/971503492848',
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      number: '+971 50 349 2848'
    },
    {
      title: 'البريد الإلكتروني',
      description: 'راسلنا عبر البريد الإلكتروني',
      icon: Mail,
      link: 'mailto:leve1up999q@gmail.com',
      color: 'bg-primary hover:bg-primary/90',
      number: 'leve1up999q@gmail.com'
    },
    {
      title: 'إنستغرام',
      description: 'تابعنا على إنستغرام',
      icon: Instagram,
      link: 'https://instagram.com/lvlup3211',
      color: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90',
      number: '@lvlup3211'
    },
    {
      title: 'تيك توك',
      description: 'شاهد محتوانا على تيك توك',
      icon: Music,
      link: 'https://www.tiktok.com/@lvlup321',
      color: 'bg-black hover:bg-gray-800',
      number: '@lvlup321'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">📞 تواصل معنا</h1>
            <p className="text-xl opacity-90">
              نحن هنا لمساعدتك! تواصل معنا عبر أي من الطرق التالية
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ArrowRight className="h-4 w-4" />
            <span>تواصل معنا</span>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full ${method.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{method.title}</h3>
                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-foreground font-medium text-center">{method.number}</p>
                  </div>
                  
                  <div className="flex items-center justify-center mt-4 text-primary group-hover:text-primary/80 transition-colors">
                    <span className="text-sm font-medium">انقر للتواصل</span>
                    <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                🕒 أوقات العمل
              </h2>
              <p className="text-muted-foreground">
                نحن متاحون للرد على استفساراتكم في الأوقات التالية:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">📱 الدعم السريع</h3>
                <p className="text-muted-foreground mb-2">واتساب والرسائل المباشرة</p>
                <p className="text-primary font-medium">24/7 - متاح دائماً</p>
              </div>
              
              <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">📧 البريد الإلكتروني</h3>
                <p className="text-muted-foreground mb-2">للاستفسارات التفصيلية</p>
                <p className="text-secondary font-medium">الرد خلال 24 ساعة</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  💬 نصائح للحصول على أفضل دعم
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• اذكر رقم الطلب عند التواصل بخصوص طلب معين</li>
                  <li>• وضح المشكلة بالتفصيل مع إرفاق صور إن أمكن</li>
                  <li>• تأكد من صحة بيانات التواصل المرسلة</li>
                  <li>• استخدم الواتساب للحصول على رد سريع</li>
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                🔗 روابط مفيدة
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/privacy-policy" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  سياسة الاستخدام
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/refund-policy" 
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                >
                  سياسة الاستبدال
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/account" 
                  className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  حسابي
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
