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
      question: 'ما هي المنتجات الرقمية؟',
      answer: 'المنتجات الرقمية هي منتجات يمكن تحميلها أو الوصول إليها عبر الإنترنت، مثل الكتب الإلكترونية، القوالب، الدورات التعليمية، والأدوات البرمجية.'
    },
    {
      question: 'كيف أستلم المنتج بعد الشراء؟',
      answer: 'بعد إتمام عملية الدفع، ستتلقى رابط تحميل فوري عبر البريد الإلكتروني يمكنك من خلاله تحميل منتجك مباشرة.'
    },
    {
      question: 'هل يمكنني استرجاع المال؟',
      answer: 'نعم، نوفر ضمان استرجاع المال خلال 30 يوماً إذا لم تكن راضياً عن المنتج.'
    },
    {
      question: 'هل المنتجات متوفرة بعدة لغات؟',
      answer: 'نعم، معظم منتجاتنا متوفرة باللغة العربية والإنجليزية.'
    }
  ] : [
    {
      question: 'What are digital products?',
      answer: 'Digital products are products that can be downloaded or accessed online, such as e-books, templates, courses, and software tools.'
    },
    {
      question: 'How do I receive the product after purchase?',
      answer: 'After completing the payment, you will receive an instant download link via email to download your product directly.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee if you are not satisfied with the product.'
    },
    {
      question: 'Are products available in multiple languages?',
      answer: 'Yes, most of our products are available in Arabic and English.'
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
