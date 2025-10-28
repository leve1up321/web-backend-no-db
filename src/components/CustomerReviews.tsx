import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const CustomerReviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "عبدالله الحربي",
      rating: 5,
      comment: "كنت دايم أقول \"المنتجات الرقمية مو لي\"، بس بعد ما جربت الطريقة اللي بشرحها الكتاب فهمت السالفة، وبديت فعلاً أشتغل على أول منتج لي."
    },
    {
      id: 2,
      name: "نورة الشهراني",
      rating: 5,
      comment: "أول مرة أشتري كتاب أونلاين وأطبّق منه فعليًا! الشرح بسيط كأنك تتعلم من أخوك الكبير اللي فاهم السوق."
    },
    {
      id: 3,
      name: "فهد الغامدي",
      rating: 5,
      comment: "ما راح أكذب، بالبداية شكّيت، بس والله المعلومات اللي فيه تستاهل كل ريال، فيها تفاصيل ما تحصلها في اليوتيوب أبد."
    },
    {
      id: 4,
      name: "ريم القحطاني",
      rating: 5,
      comment: "ما توقعت أستفيد لهالدرجة، صرت أعرف أبيع قوالب رقمية وسويتها فعلاً وبدأت أبيع كم نسخة."
    },
    {
      id: 5,
      name: "خالد الزهراني",
      rating: 5,
      comment: "حبيت إن المحتوى مرتب، مو حوسة. كل شي خطوة بخطوة ومو معقد، حتى للي ما عنده خبرة."
    },
    {
      id: 6,
      name: "مشاعل المطيري",
      rating: 5,
      comment: "أكثر شي أعجبني إن كل فكرة قابلة للتطبيق، مو بس كلام تحفيزي فاضي، فعلاً تقدر تبدأ."
    },
    {
      id: 7,
      name: "راكان العنزي",
      rating: 5,
      comment: "كنت أحوس بين أفكار كثيرة، والكتاب هذا خلاني أحدد وش يناسبني فعلاً، اختصرت وقتي شهور."
    },
    {
      id: 8,
      name: "دلال الدوسري",
      rating: 5,
      comment: "حسّيت إنه يكلمني بلغة أفهمها، مو مصطلحات معقدة، حبيت الأسلوب مرة."
    },
    {
      id: 9,
      name: "ماجد اليامي",
      rating: 5,
      comment: "من جد، هذا أول منتج رقمي أشتريه وأحس إني استفدت منه للآخر. كل صفحة فيها شي تطبقه."
    },
    {
      id: 10,
      name: "لطيفة الهاجري",
      rating: 5,
      comment: "كنت محتارة من وين أبدأ، الحين عندي فكرة واضحة وشكل ببدأ مشروعي خلال الأسبوع الجاي."
    },
    {
      id: 11,
      name: "يزن العتيبي",
      rating: 5,
      comment: "ما شاء الله التفاصيل دقيقة، كأنك جالس مع شخص فاهم المجال من سنين ويعطيك الزبدة بدون لف."
    },
    {
      id: 12,
      name: "رغد العبدالله",
      rating: 5,
      comment: "أكثر جزء شدّني هو كيف تختار المنتج المناسب لك، فعلاً ساعدني ألقى الفكرة اللي تمشي معي."
    },
    {
      id: 13,
      name: "ناصر العتيق",
      rating: 5,
      comment: "ترى أنا ما أحب أقرأ كثير، بس الكتاب مشوّق، تقراه وتحس الوقت طار من بساطته."
    },
    {
      id: 14,
      name: "منى السبيعي",
      rating: 5,
      comment: "المعلومات سهلة وواضحة، وخلتني أفكر بطريقة مختلفة تمامًا عن التسويق الرقمي."
    },
    {
      id: 15,
      name: "طلال الشهراني",
      rating: 5,
      comment: "لو أحد شرح لي كذا من زمان كان وفرت على نفسي سنين من التخبط، طريقة بسيطة ومفهومة."
    },
    {
      id: 16,
      name: "هناء الدوسري",
      rating: 5,
      comment: "حسّيت إن المحتوى موجه لي بالضبط، لأن ما عندي خلفية أبداً وكنت محتاجة بداية واضحة."
    },
    {
      id: 17,
      name: "فيصل القاضي",
      rating: 5,
      comment: "أكثر شي يميز الكتاب إنه عملي، كل جزء فيه أداة أو موقع تقدر تبدأ منه مباشرة."
    },
    {
      id: 18,
      name: "سارة الشمري",
      rating: 5,
      comment: "مرة حبيت كيف إنه ما يطوّل في الكلام، يعطيك الزبدة على طول، ما تضيع وقتك."
    },
    {
      id: 19,
      name: "بدر الحربي",
      rating: 5,
      comment: "جربت كثير دورات وكتب، بس هذا الوحيد اللي خلاني أتحرك فعليًا وأسوي شي."
    },
    {
      id: 20,
      name: "جود المطيري",
      rating: 5,
      comment: "أنا من الناس اللي ما تحب المصطلحات المعقدة، بس هنا كل شي مفسر ببساطة ووضوح."
    },
    {
      id: 21,
      name: "عبدالله الرشيدي",
      rating: 5,
      comment: "حسّيت إني داخل مشروع جاهز، كل خطوة مكتوبة، حتى الأدوات موجودة، بس تطبّق وتمشي."
    },
    {
      id: 22,
      name: "مها العنزي",
      rating: 5,
      comment: "صراحة حسّيت بثقة أكثر بعد ما قرأته، الحين أعرف وين أبدأ وكيف أتعامل مع المنصات."
    },
    {
      id: 23,
      name: "راشد الدوسري",
      rating: 5,
      comment: "ما توقعت أتعلم التسويق بهالسهولة، شرح مبسط ويخليك تطبّق بدون تعقيد."
    },
    {
      id: 24,
      name: "رنا الحارثي",
      rating: 5,
      comment: "الكتاب فتح لي أفكار جديدة ما كانت تخطر في بالي، خصوصًا جزء المحتوى الرقمي."
    },
    {
      id: 25,
      name: "يزيد الغامدي",
      rating: 5,
      comment: "حتى وأنا مشغول قدرت أخلصه، خفيف وسهل، وكل نقطة فيه مفيدة فعلًا."
    },
    {
      id: 26,
      name: "نورة العبدالرحمن",
      rating: 5,
      comment: "أكثر شي حبيته إن ما فيه حشو، كل سطر له معنى، ما حسّيت ولا دقيقة إني أضيع وقتي."
    },
    {
      id: 27,
      name: "تركي السبيعي",
      rating: 5,
      comment: "بصراحة أول مرة أطبق خطوة من كتاب وأشوف نتيجة بنفس الأسبوع، تجربة تستحق."
    },
    {
      id: 28,
      name: "روان القحطاني",
      rating: 5,
      comment: "حسّيت بثقة لما فهمت كيف أقدر أبيع منتج رقمي بسيط بدون تعقيد أو تكاليف."
    },
    {
      id: 29,
      name: "عادل الفريدي",
      rating: 5,
      comment: "كنت أحسب الموضوع يبغاله خبرة كبيرة، بس طلع أسهل بكثير من اللي كنت أتخيله."
    },
    {
      id: 30,
      name: "سارة السويلم",
      rating: 5,
      comment: "اللي شدني إن المحتوى يكلّمك كأنك صديق، تحس الشخص فعلاً فاهم الصعوبات اللي تمر فيها."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000); // كل 4 ثواني

    return () => clearInterval(interval);
  }, [reviews.length]);

  const currentReviewData = reviews[currentReview];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-secondary/10 to-primary/10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ماذا يقول عملاؤنا؟
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            أكثر من 300 شخص جرّبوا الدليل وبدأوا مشاريعهم الرقمية 💡
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-6 w-6 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
              
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
                "{currentReviewData.comment}"
              </blockquote>
              
              <div className="text-primary font-bold text-lg">
                - {currentReviewData.name}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8 space-x-2">
          {reviews.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentReview % 10
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
