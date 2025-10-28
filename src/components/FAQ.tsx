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
      question: "كيف يمكنني شراء المنتجات؟",
      answer: "يمكنك إضافة المنتجات لسلة التسوق والضغط على 'إتمام الشراء'. ستتم إعادة توجيهك لصفحة الدفع الآمنة."
    },
    {
      question: "كيف أحصل على المنتج بعد الشراء؟",
      answer: "بعد إتمام عملية الدفع، ستحصل على رابط التحميل المباشر عبر البريد الإلكتروني فوراً."
    },
    {
      question: "هل المنتجات مضمونة الجودة؟",
      answer: "نعم، جميع منتجاتنا مجربة ومختبرة. نقدم ضمان استرداد الأموال خلال 7 أيام إذا لم تكن راضياً."
    },
    {
      question: "هل يوجد دعم فني؟",
      answer: "نعم، فريق الدعم متاح 24/7 عبر واتساب والبريد الإلكتروني لمساعدتك في أي استفسار."
    },
    {
      question: "هل يمكنني الدفع بعملات مختلفة؟",
      answer: "نعم، الموقع يدعم 5 عملات مختلفة مع تحويل الأسعار تلقائياً."
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
    <section id="faq" className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('faqTitle')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('faqSubtitle')}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
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
