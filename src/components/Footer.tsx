import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-card/50 border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Level Up Store
            </h3>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'وجهتك لبناء مشروعك الرقمي 💡 ابدأ من الصفر وابنِ أول دخل رقمي لك اليوم'
                : 'Your destination for building your digital project 💡 Start from zero and build your first digital income today'}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">{t('home')}</a></li>
              <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">{t('products')}</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">{t('reviews')}</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">{t('faq')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@levelupstore.com</p>
              <p>
                {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'} © {currentYear}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground">
            {language === 'ar'
              ? 'صُنع بـ ❤️ في المملكة العربية السعودية'
              : 'Made with ❤️ in Saudi Arabia'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
