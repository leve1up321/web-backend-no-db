"use client"

import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "عبدالله الحربي",
    time: "منذ أسبوعين",
    text: "كنت دايم أقول \"المنتجات الرقمية مو لي\"، بس بعد ما جربت الطريقة اللي بشرحها الكتاب فهمت السالفة، وبديت فعلاً أشتغل على أول منتج لي."
  },
  {
    name: "نورة الشهراني",
    time: "منذ 3 أيام",
    text: "أول مرة أشتري كتاب أونلاين وأطبّق منه فعلياً! الشرح بسيط كأنك تتعلم من أخوك الكبير اللي فاهم السوق."
  },
  {
    name: "فهد الغامدي",
    time: "منذ 5 أيام",
    text: "ما راح أكذب، بالبداية شكّيت، بس والله المعلومات اللي فيه تستاهل كل ريال، فيها تفاصيل ما تحصلها في اليوتيوب أبد."
  },
  {
    name: "ريم القحطاني",
    time: "منذ أسبوع",
    text: "ما توقعت أستفيد لهالدرجة، صرت أعرف أبيع قوالب رقمية وسويتها فعلاً وبدأت أبيع كم نسخة."
  },
  {
    name: "خالد الزهراني",
    time: "منذ 4 أيام",
    text: "حبيت إن المحتوى مرتب، مو حوسة. كل شي خطوة بخطوة ومو معقد، حتى للي ما عنده خبرة."
  },
  {
    name: "مشاعل المطيري",
    time: "منذ 6 أيام",
    text: "أكثر شي أعجبني إن كل فكرة قابلة للتطبيق، مو بس كلام تحفيزي فاضي، فعلاً تقدر تبدأ."
  },
  {
    name: "راكان العنزي",
    time: "منذ 10 أيام",
    text: "كنت أحوس بين أفكار كثيرة، والكتاب هذا خلاني أحدد وش يناسبني فعلاً، اختصرت وقتي شهور."
  },
  {
    name: "دلال الدوسري",
    time: "منذ أسبوع",
    text: "حسّيت إنه يكلمني بلغة أفهمها، مو مصطلحات معقدة، حبيت الأسلوب مرة."
  },
  {
    name: "ماجد اليامي",
    time: "منذ 3 أيام",
    text: "من جد، هذا أول منتج رقمي أشتريه وأحس إني استفدت منه للآخر. كل صفحة فيها شي تطبقه."
  },
  {
    name: "لطيفة الهاجري",
    time: "منذ يومين",
    text: "كنت محتارة من وين أبدأ، الحين عندي فكرة واضحة وشكل ببدأ مشروعي خلال الأسبوع الجاي."
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">التقييمات</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            أكثر من 300 شخص جرّبوا الدليل وبدأوا مشاريعهم الرقمية 💡
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border hover:border-purple-500 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex space-x-1 space-x-reverse mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="font-bold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

