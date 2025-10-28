import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Reviews = () => {
  const { t, language } = useLanguage();

  const reviews = [
    {
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      rating: 5,
      comment: language === 'ar' 
        ? 'منتجات رائعة وعملية! استفدت كثيراً من الأفكار المطروحة وبدأت مشروعي الأول بنجاح. شكراً لفريق لفل اب!'
        : 'Great and practical products! I benefited a lot from the ideas presented and started my first project successfully. Thanks to the Level Up team!',
      date: language === 'ar' ? 'منذ أسبوعين' : '2 weeks ago'
    },
    {
      name: language === 'ar' ? 'فاطمة العلي' : 'Fatima Al Ali',
      rating: 5,
      comment: language === 'ar'
        ? 'كتب مفيدة جداً ومكتوبة بطريقة سهلة ومفهومة. الأفكار عملية ويمكن تطبيقها فوراً. أنصح بها بشدة!'
        : 'Very useful books written in an easy and understandable way. The ideas are practical and can be applied immediately. Highly recommend!',
      date: language === 'ar' ? 'منذ 3 أيام' : '3 days ago'
    },
    {
      name: language === 'ar' ? 'خالد السعيد' : 'Khaled Al Saeed',
      rating: 5,
      comment: language === 'ar'
        ? 'استثمار ممتاز! المحتوى قيم والأسعار معقولة. حققت أول ربح لي من الإنترنت بفضل هذه الكتب.'
        : 'Excellent investment! Valuable content and reasonable prices. I made my first online profit thanks to these books.',
      date: language === 'ar' ? 'منذ 5 أيام' : '5 days ago'
    }
  ];

  return (
    <section id="reviews" className="py-20 px-4 bg-background/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('reviews')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === 'ar' ? 'ماذا يقول عملاؤنا' : 'What Our Customers Say'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{review.name}</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;