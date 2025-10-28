import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Level Up Store
            </h3>
            <p className="text-muted-foreground">
              {t('companyDescription')}
            </p>
            <p className="text-muted-foreground mt-2">
              {t('heroSubtitle')}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">{t('home')}</a></li>
              <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">{t('products')}</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">{t('reviews')}</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('contactInfo')}
            </h4>
            <div className="space-y-2 text-muted-foreground">
              <p>📧 leve1up999q@gmail.com</p>
              <p>📱 +971503492848</p>
              <p>📸 @lvlup3211</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground">
            © {currentYear} Level Up Store. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
