import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

const Contact = () => {
  const { t, language } = useLanguage();

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      link: 'mailto:leve1up999q@gmail.com'
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      link: 'https://wa.me/971503492848'
    },
    {
      icon: <Instagram className="h-8 w-8" />,
      link: 'https://instagram.com/lvlup3211'
    }
  ];

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('contact')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            {language === 'ar' ? 'نحب أن نسمع منك!' : 'We\'d Love to Hear From You!'}
          </p>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'لا تتردد في التواصل معنا عبر أي من الطرق التالية. فريق الدعم جاهز لمساعدتك في كل خطوة من رحلتك الرقمية'
              : 'Feel free to contact us through any of the following methods. Our support team is ready to help you at every step of your digital journey'}
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <a 
              key={index} 
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 transition-all duration-300 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30"
            >
              {method.icon}
            </a>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              🎯 {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Start?'}
            </h3>
            <p className="text-lg text-foreground/90 mb-6 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'كل يوم تأجّله هو فرصة ضائعة! ابدأ مشروعك الرقمي اليوم واحصل على دخلك الأول'
                : 'Every day you postpone is a lost opportunity! Start your digital project today and get your first income'}
            </p>
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
            >
              {language === 'ar' ? 'ابدأ الآن' : 'Start Now'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
