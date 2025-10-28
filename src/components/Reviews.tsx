import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Reviews = () => {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews = [
    {
      name: 'عبدالله الحربي',
      rating: 5,
      comment: 'كنت دايم أقول "المنتجات الرقمية مو لي"، بس بعد ما جربت الطريقة اللي بشرحها الكتاب فهمت السالفة، وبديت فعلاً أشتغل على أول منتج لي.',
      date: 'منذ أسبوعين'
    },
    {
      name: 'نورة الشهراني',
      rating: 5,
      comment: 'أول مرة أشتري كتاب أونلاين وأطبّق منه فعليًا! الشرح بسيط كأنك تتعلم من أخوك الكبير اللي فاهم السوق.',
      date: 'منذ 3 أيام'
    },
    {
      name: 'فهد الغامدي',
      rating: 5,
      comment: 'ما راح أكذب، بالبداية شكّيت، بس والله المعلومات اللي فيه تستاهل كل ريال، فيها تفاصيل ما تحصلها في اليوتيوب أبد.',
      date: 'منذ 5 أيام'
    },
    {
      name: 'ريم القحطاني',
      rating: 5,
      comment: 'ما توقعت أستفيد لهالدرجة، صرت أعرف أبيع قوالب رقمية وسويتها فعلاً وبدأت أبيع كم نسخة.',
      date: 'منذ أسبوع'
    },
    {
      name: 'خالد الزهراني',
      rating: 5,
      comment: 'حبيت إن المحتوى مرتب، مو حوسة. كل شي خطوة بخطوة ومو معقد، حتى للي ما عنده خبرة.',
      date: 'منذ 4 أيام'
    },
    {
      name: 'مشاعل المطيري',
      rating: 5,
      comment: 'أكثر شي أعجبني إن كل فكرة قابلة للتطبيق، مو بس كلام تحفيزي فاضي، فعلاً تقدر تبدأ.',
      date: 'منذ 6 أيام'
    },
    {
      name: 'راكان العنزي',
      rating: 5,
      comment: 'كنت أحوس بين أفكار كثيرة، والكتاب هذا خلاني أحدد وش يناسبني فعلاً، اختصرت وقتي شهور.',
      date: 'منذ 10 أيام'
    },
    {
      name: 'دلال الدوسري',
      rating: 5,
      comment: 'حسّيت إنه يكلمني بلغة أفهمها، مو مصطلحات معقدة، حبيت الأسلوب مرة.',
      date: 'منذ أسبوع'
    },
    {
      name: 'ماجد اليامي',
      rating: 5,
      comment: 'من جد، هذا أول منتج رقمي أشتريه وأحس إني استفدت منه للآخر. كل صفحة فيها شي تطبقه.',
      date: 'منذ 3 أيام'
    },
    {
      name: 'لطيفة الهاجري',
      rating: 5,
      comment: 'كنت محتارة من وين أبدأ، الحين عندي فكرة واضحة وشكل ببدأ مشروعي خلال الأسبوع الجاي.',
      date: 'منذ يومين'
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          const currentScroll = scrollContainer.scrollLeft;
          
          if (currentScroll >= maxScroll) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: scrollContainer.clientWidth, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, []);

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
            أكثر من 300 شخص جرّبوا الدليل وبدأوا مشاريعهم الرقمية 💡
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory max-w-6xl mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...reviews, ...reviews].map((review, index) => (
            <Card 
              key={index} 
              className="min-w-[300px] md:min-w-[350px] snap-center bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed min-h-[100px]">
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
