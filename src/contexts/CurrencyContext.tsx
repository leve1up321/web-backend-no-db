import React, { createContext, useContext, useState } from 'react';

type CurrencyCode = 'SAR' | 'USD' | 'EUR' | 'AED' | 'EGP';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (price: number) => string;
}

const currencies: Record<CurrencyCode, Currency> = {
  SAR: { code: 'SAR', symbol: 'ر.س', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.27 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.24 },
  AED: { code: 'AED', symbol: 'د.إ', rate: 0.98 },
  EGP: { code: 'EGP', symbol: 'ج.م', rate: 8.25 },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('levelup-currency');
    return currencies[saved as CurrencyCode] || currencies.SAR;
  });

  const setCurrency = (code: CurrencyCode) => {
    const newCurrency = currencies[code];
    setCurrencyState(newCurrency);
    localStorage.setItem('levelup-currency', code);
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = (price * currency.rate).toFixed(2);
    return `${convertedPrice} ${currency.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
