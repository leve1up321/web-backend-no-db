"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "🔹 1. هل هذا الكتاب مناسب للمبتدئين تماماً؟",
    answer: "نعم! الكتاب مصمم خصيصاً للمبتدئين الذين ليس لديهم أي خبرة سابقة في المنتجات الرقمية. نبدأ معك من الصفر ونشرح كل شيء بطريقة بسيطة وواضحة."
  },
  {
    question: "🔹 2. هل أحتاج رأس مال عشان أبدأ مشروع رقمي؟",
    answer: "لا، معظم الأفكار المذكورة في الكتاب لا تحتاج رأس مال كبير. يمكنك البدء بأدوات مجانية أو بتكلفة بسيطة جداً."
  },
  {
    question: "🔹 3. هل الكتاب ملف PDF؟ وكيف أقدر أفتحه بعد الشراء؟",
    answer: "نعم، الكتاب عبارة عن ملف PDF عالي الجودة. بعد إتمام عملية الشراء، ستحصل على رابط التحميل مباشرة عبر البريد الإلكتروني ويمكنك فتحه على أي جهاز."
  },
  {
    question: "🔹 4. هل المحتوى منسوخ أو مأخوذ من الإنترنت؟",
    answer: "لا، جميع المحتوى أصلي ومكتوب بناءً على خبرة عملية حقيقية. كل فكرة ونصيحة مجربة ومضمونة."
  },
  {
    question: "🔹 5. كم يستغرق الوقت حتى أبدأ أحقق دخل من الأفكار؟",
    answer: "يختلف حسب التزامك وجهدك، لكن معظم المشترين بدأوا يشوفون نتائج خلال 2-4 أسابيع من التطبيق."
  },
  {
    question: "🔹 6. هل في تحديثات مستقبلية للكتاب؟",
    answer: "نعم، الكتاب يتم تحديثه باستمرار مع إضافة أفكار جديدة ونصائح محدثة. كل من يشتري الكتاب يحصل على التحديثات مجاناً."
  },
  {
    question: "🔹 7. هل أقدر أسترجع المبلغ لو ما استفدت؟",
    answer: "نعم، نوفر ضمان استرجاع المبلغ خلال 7 أيام إذا لم تكن راضياً عن المحتوى."
  },
  {
    question: "🔹 8. هل الكتاب مفيد للطلاب أو الموظفين؟",
    answer: "بالتأكيد! الكتاب مناسب لأي شخص يبحث عن دخل إضافي أو يريد بناء مشروع جانبي بجانب دراسته أو وظيفته."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-purple-950/5 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">الأسئلة الشائعة</h2>
          <p className="text-xl text-muted-foreground">
            أجوبة لأكثر الأسئلة شيوعاً
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-right hover:bg-accent/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-6 w-6 text-purple-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

