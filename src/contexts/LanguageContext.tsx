import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    reviews: "التقييمات",
    faq: "الأسئلة الشائعة",
    contact: "اتصل بنا",
    heroTitle: "متجر لفل اب",
    heroSubtitle: "💡 ابدأ من الصفر وابنِ أول دخل رقمي لك اليوم!",
    heroDescription: "اكتشف كيف تحوّل مهاراتك أو وقتك إلى مصدر دخل مستمر من خلال بيع منتجات رقمية بسيطة تحقق لك أرباحًا حتى أثناء نومك 😴💰",
    startJourney: "ابدأ رحلتك الآن",
    shopNow: "تسوق الآن",
    ourProducts: "منتجاتنا",
    productsSubtitle: "اكتشف مجموعتنا المميزة من المنتجات الرقمية",
    addToCart: "إضافة للسلة",
    viewDetails: "عرض التفاصيل",
    cart: "سلة التسوق",
    emptyCart: "السلة فارغة",
    total: "المجموع",
    checkout: "إتمام الشراء",
    addedToCart: "تم إضافة المنتج إلى السلة",
    removedFromCart: "تم حذف المنتج من السلة",
    backToHome: "العودة للرئيسية",
    productDescription: "وصف المنتج",
    rating: "تقييم",
    reviewsText: "تقييمات",
    features: "المميزات",
    quantity: "الكمية",
    faqTitle: "الأسئلة الشائعة",
    faqSubtitle: "إجابات على أهم الأسئلة التي قد تخطر ببالك",
  },
  en: {
    home: "Home",
    products: "Products",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    heroTitle: "Level Up Store",
    heroSubtitle: "💡 Start from zero and build your first digital income today!",
    heroDescription: "Discover how to turn your skills or time into a continuous source of income by selling simple digital products that generate profits even while you sleep 😴💰",
    startJourney: "Start Your Journey",
    shopNow: "Shop Now",
    ourProducts: "Our Products",
    productsSubtitle: "Discover our distinctive collection of digital products",
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    cart: "Shopping Cart",
    emptyCart: "Cart is empty",
    total: "Total",
    checkout: "Checkout",
    addedToCart: "Product added to cart",
    removedFromCart: "Product removed from cart",
    backToHome: "Back to Home",
    productDescription: "Product Description",
    rating: "Rating",
    reviewsText: "Reviews",
    features: "Features",
    quantity: "Quantity",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Answers to the most important questions you may have",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('levelup-language');
    return (saved === 'en' ? 'en' : 'ar') as Language;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('levelup-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
