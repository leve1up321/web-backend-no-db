import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Reviews = () => {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

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
    },
    {
      name: 'يزن العتيبي',
      rating: 5,
      comment: 'ما شاء الله التفاصيل دقيقة، كأنك جالس مع شخص فاهم المجال من سنين ويعطيك الزبدة بدون لف.',
      date: 'منذ أسبوع'
    },
    {
      name: 'رغد العبدالله',
      rating: 5,
      comment: 'أكثر جزء شدّني هو كيف تختار المنتج المناسب لك، فعلاً ساعدني ألقى الفكرة اللي تمشي معي.',
      date: 'منذ 5 أيام'
    },
    {
      name: 'ناصر العتيق',
      rating: 5,
      comment: 'ترى أنا ما أحب أقرأ كثير، بس الكتاب مشوّق، تقراه وتحس الوقت طار من بساطته.',
      date: 'منذ 8 أيام'
    },
    {
      name: 'منى السبيعي',
      rating: 5,
      comment: 'المعلومات سهلة وواضحة، وخلتني أفكر بطريقة مختلفة تمامًا عن التسويق الرقمي.',
      date: 'منذ 4 أيام'
    },
    {
      name: 'طلال الشهراني',
      rating: 5,
      comment: 'لو أحد شرح لي كذا من زمان كان وفرت على نفسي سنين من التخبط، طريقة بسيطة ومفهومة.',
      date: 'منذ 12 يوم'
    },
    {
      name: 'هناء الدوسري',
      rating: 5,
      comment: 'حسّيت إن المحتوى موجه لي بالضبط، لأن ما عندي خلفية أبداً وكنت محتاجة بداية واضحة.',
      date: 'منذ 6 أيام'
    },
    {
      name: 'فيصل القاضي',
      rating: 5,
      comment: 'أكثر شي يميز الكتاب إنه عملي، كل جزء فيه أداة أو موقع تقدر تبدأ منه مباشرة.',
      date: 'منذ 9 أيام'
    },
    {
      name: 'سارة الشمري',
      rating: 5,
      comment: 'مرة حبيت كيف إنه ما يطوّل في الكلام، يعطيك الزبدة على طول، ما تضيع وقتك.',
      date: 'منذ 3 أيام'
    },
    {
      name: 'بدر الحربي',
      rating: 5,
      comment: 'جربت كثير دورات وكتب، بس هذا الوحيد اللي خلاني أتحرك فعليًا وأسوي شي.',
      date: 'منذ أسبوعين'
    },
    {
      name: 'جود المطيري',
      rating: 5,
      comment: 'أنا من الناس اللي ما تحب المصطلحات المعقدة، بس هنا كل شي مفسر ببساطة ووضوح.',
      date: 'منذ 7 أيام'
    },
    {
      name: 'عبدالله الرشيدي',
      rating: 5,
      comment: 'حسّيت إني داخل مشروع جاهز، كل خطوة مكتوبة، حتى الأدوات موجودة، بس تطبّق وتمشي.',
      date: 'منذ 5 أيام'
    },
    {
      name: 'مها العنزي',
      rating: 5,
      comment: 'صراحة حسّيت بثقة أكثر بعد ما قرأته، الحين أعرف وين أبدأ وكيف أتعامل مع المنصات.',
      date: 'منذ 4 أيام'
    },
    {
      name: 'راشد الدوسري',
      rating: 5,
      comment: 'ما توقعت أتعلم التسويق بهالسهولة، شرح مبسط ويخليك تطبّق بدون تعقيد.',
      date: 'منذ 10 أيام'
    },
    {
      name: 'رنا الحارثي',
      rating: 5,
      comment: 'الكتاب فتح لي أفكار جديدة ما كانت تخطر في بالي، خصوصًا جزء المحتوى الرقمي.',
      date: 'منذ 6 أيام'
    },
    {
      name: 'يزيد الغامدي',
      rating: 5,
      comment: 'حتى وأنا مشغول قدرت أخلصه، خفيف وسهل، وكل نقطة فيه مفيدة فعلاً.',
      date: 'منذ 8 أيام'
    },
    {
      name: 'نورة العبدالرحمن',
      rating: 5,
      comment: 'أكثر شي حبيته إن ما فيه حشو، كل سطر له معنى، ما حسّيت ولا دقيقة إني أضيع وقتي.',
      date: 'منذ 3 أيام'
    },
    {
      name: 'تركي السبيعي',
      rating: 5,
      comment: 'بصراحة أول مرة أطبق خطوة من كتاب وأشوف نتيجة بنفس الأسبوع، تجربة تستحق.',
      date: 'منذ أسبوع'
    },
    {
      name: 'روان القحطاني',
      rating: 5,
      comment: 'حسّيت بثقة لما فهمت كيف أقدر أبيع منتج رقمي بسيط بدون تعقيد أو تكاليف.',
      date: 'منذ 5 أيام'
    },
    {
      name: 'عادل الفريدي',
      rating: 5,
      comment: 'كنت أحسب الموضوع يبغاله خبرة كبيرة، بس طلع أسهل بكثير من اللي كنت أتخيله.',
      date: 'منذ 9 أيام'
    },
    {
      name: 'سارة السويلم',
      rating: 5,
      comment: 'اللي شدني إن المحتوى يكلّمك كأنك صديق، تحس الشخص فعلاً فاهم الصعوبات اللي تمر فيها.',
      date: 'منذ 4 أيام'
    }
  ];

  // دوال التحكم اليدوي
  const scrollLeft = () => {
    if (scrollRef.current) {
      setIsAutoScrolling(false);
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      setIsAutoScrolling(false);
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isAutoScrolling) return;

    let scrollInterval: NodeJS.Timeout;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer && isAutoScrolling) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          const currentScroll = scrollContainer.scrollLeft;
          
          if (currentScroll >= maxScroll) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: 350, behavior: 'smooth' });
          }
        }
      }, 4000); // زيادة الوقت قليلاً
    };

    startAutoScroll();

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isAutoScrolling]);

  // إعادة تشغيل التحريك التلقائي بعد فترة من التوقف
  useEffect(() => {
    if (!isAutoScrolling) {
      const timer = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 10000); // 10 ثوان

      return () => clearTimeout(timer);
    }
  }, [isAutoScrolling]);

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

        <div className="relative max-w-6xl mx-auto">
          {/* أزرار التحكم */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/20 hover:bg-primary/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="السابق"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary/20 hover:bg-primary/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="التالي"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review, index) => (
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
          
          {/* مؤشر التحريك التلقائي */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isAutoScrolling ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
              <span>{isAutoScrolling ? 'تحريك تلقائي' : 'تحكم يدوي'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
