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
    language: "اللغة",
    currency: "العملة",
    heroTitle: "متجر لفل اب",
    heroSubtitle: "💡 ابدأ من الصفر وابنِ أول دخل رقمي لك اليوم!",
    heroDescription: "حوّل مهاراتك ووقتك إلى دخل حقيقي. انضم لآلاف الأشخاص اللي حققوا حلمهم في العمل الحر والربح من الإنترنت.",
    startJourney: "ابدأ رحلتك الآن",
    shopNow: "تسوق الآن",
    ourProducts: "منتجاتنا",
    productsSubtitle: "اختر الكتاب المناسب لك وابدأ رحلتك نحو النجاح",
    addToCart: "أضف للسلة",
    viewDetails: "عرض التفاصيل",
    cart: "السلة",
    emptyCart: "السلة فارغة!",
    total: "المجموع",
    checkout: "إتمام الشراء",
    remove: "حذف",
    addedToCart: "تم إضافة المنتج إلى السلة",
    removedFromCart: "تم حذف المنتج من السلة",
    backToHome: "العودة للرئيسية",
    productDescription: "وصف المنتج",
    rating: "تقييم",
    reviewsText: "تقييمات",
    features: "المميزات",
    quantity: "الكمية",
    faqTitle: "الأسئلة الشائعة",
    faqSubtitle: "أجوبة لأكثر الأسئلة شيوعاً",
    company: "الشركة",
    companyDescription: "وجهتك لبناء مشروعك الرقمي",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات التواصل",
    allRightsReserved: "جميع الحقوق محفوظة",
  },
  en: {
    home: "Home",
    products: "Products",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    language: "Language",
    currency: "Currency",
    heroTitle: "Level Up Store",
    heroSubtitle: "💡 Start from scratch and build your first digital income today!",
    heroDescription: "Turn your skills and time into real income. Join thousands of people who achieved their dream of freelancing and earning online.",
    startJourney: "Start Your Journey",
    shopNow: "Shop Now",
    ourProducts: "Our Products",
    productsSubtitle: "Choose the right book for you and start your journey to success",
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    cart: "Cart",
    emptyCart: "Cart is empty!",
    total: "Total",
    checkout: "Checkout",
    remove: "Remove",
    addedToCart: "Product added to cart",
    removedFromCart: "Product removed from cart",
    backToHome: "Back to Home",
    productDescription: "Product Description",
    rating: "Rating",
    reviewsText: "Reviews",
    features: "Features",
    quantity: "Quantity",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Answers to the most common questions",
    company: "Company",
    companyDescription: "Your destination for building your digital project",
    quickLinks: "Quick Links",
    contactInfo: "Contact Information",
    allRightsReserved: "All Rights Reserved",
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
