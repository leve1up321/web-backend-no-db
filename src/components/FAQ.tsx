import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const { t, language } = useLanguage();

  const faqs = language === 'ar' ? [
    {
      question: "🔹 1. هل هذا الكتاب مناسب للمبتدئين تمامًا؟",
      answer: "نعم، الكتاب مصمم خصيصًا للمبتدئين اللي ما عندهم أي خبرة سابقة في المشاريع الرقمية. يشرح لك كل فكرة من الصفر، مع الأدوات المجانية اللي تحتاجها، وخطوات عملية بسيطة للتنفيذ."
    },
    {
      question: "🔹 2. هل أحتاج رأس مال عشان أبدأ مشروع رقمي؟",
      answer: "أبدًا 💡 أغلب المشاريع الموجودة في الكتاب يمكن تبدأها بدون أي رأس مال، وحتى المشاريع اللي تحتاج أدوات مدفوعة، موضّح فيها البدائل المجانية خطوة بخطوة."
    },
    {
      question: "🔹 3. هل الكتاب ملف PDF؟ وكيف أقدر أفتحه بعد الشراء؟",
      answer: "نعم، الكتاب بصيغة PDF تفاعلي يمكنك تحميله فورًا بعد إتمام عملية الدفع. تقدر تفتحه بسهولة على الجوال أو الكمبيوتر أو التابلت في أي وقت."
    },
    {
      question: "🔹 4. هل المحتوى منسوخ أو مأخوذ من الإنترنت؟",
      answer: "لا إطلاقًا 🚫 الكتاب مكتوب ومصمّم بالكامل بشكل أصلي وحصري، مبني على خبرات وتجارب حقيقية في المشاريع الرقمية، ومرتب بأسلوب عربي بسيط وسهل التطبيق."
    },
    {
      question: "🔹 5. كم يستغرق الوقت حتى أبدأ أحقق دخل من الأفكار؟",
      answer: "يعتمد على الفكرة اللي تختارها ومدى التزامك بالتطبيق، لكن كثير من القرّاء شاركونا إنهم بدأوا يشوفوا نتائج فعلية خلال أول 3 إلى 4 أسابيع من التطبيق المنتظم."
    },
    {
      question: "🔹 6. هل في تحديثات مستقبلية للكتاب؟",
      answer: "نعم ✅ عند شراء الكتاب، ستحصل تلقائيًا على تحديثات مجانية مدى الحياة، بما في ذلك أفكار جديدة وأدوات محدثة مع تطور السوق الرقمي."
    },
    {
      question: "🔹 7. هل أقدر أسترجع المبلغ لو ما استفدت؟",
      answer: "نحن واثقون أنك ستستفيد بإذن الله 🙏 لكن إن واجهت أي مشكلة حقيقية أو شعرت أن المحتوى ما يناسبك، فيمكنك التواصل معنا خلال 7 أيام من الشراء، وسنراجع حالتك بكل شفافية."
    },
    {
      question: "🔹 8. هل الكتاب مفيد للطلاب أو الموظفين؟",
      answer: "بالتأكيد 👨‍💻 الكتاب مناسب لأي شخص حابب يبدأ مصدر دخل جانبي من الإنترنت، سواء طالب، موظف، أو حتى شخص يبحث عن استقلال مالي من العمل التقليدي."
    }
  ] : [
    {
      question: "How can I purchase products?",
      answer: "You can add products to the cart and click 'Checkout'. You will be redirected to a secure payment page."
    },
    {
      question: "How do I receive the product after purchase?",
      answer: "After completing the payment, you will receive the download link directly via email immediately."
    },
    {
      question: "Are the products guaranteed quality?",
      answer: "Yes, all our products are tested and verified. We offer a 7-day money-back guarantee if you're not satisfied."
    },
    {
      question: "Is there technical support?",
      answer: "Yes, our support team is available 24/7 via WhatsApp and email to help you with any inquiries."
    },
    {
      question: "Can I pay in different currencies?",
      answer: "Yes, the site supports 5 different currencies with automatic price conversion."
    }
  ];

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-card/50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('faqTitle')}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            {t('faqSubtitle')}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-lg px-3 sm:px-4 md:px-6"
            >
              <AccordionTrigger className="text-sm sm:text-base md:text-lg font-semibold hover:text-primary text-left leading-relaxed py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
