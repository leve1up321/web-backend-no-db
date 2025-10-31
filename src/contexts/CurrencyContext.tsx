import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyCode = 'SAR' | 'AED';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  icon: string;
  image: string;
  name: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (price: number, showIcon?: boolean) => string | JSX.Element;
  isLoading: boolean;
}

// Fallback rates in case API fails
const fallbackCurrencies: Record<CurrencyCode, Currency> = {
  SAR: { 
    code: 'SAR', 
    symbol: 'ر.س', 
    rate: 1, 
    icon: '🇸🇦',
    image: '/currencies/sar.svg',
    name: 'الريال السعودي'
  },
  AED: { 
    code: 'AED', 
    symbol: 'D', 
    rate: 0.98, 
    icon: '🇦🇪',
    image: '/currencies/aed.svg',
    name: 'الدرهم الإماراتي'
  },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('levelup-currency');
    return fallbackCurrencies[saved as CurrencyCode] || fallbackCurrencies.SAR;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});

  // Fetch live exchange rates
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
      const data = await response.json();
      
      if (data.rates) {
        setRates(data.rates);
        // Update current currency with live rate
        const currentCode = currency.code;
        if (currentCode !== 'SAR' && data.rates[currentCode]) {
          setCurrencyState(prev => ({
            ...prev,
            rate: data.rates[currentCode]
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback rates:', error);
      // Keep using fallback rates
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    // Refresh rates every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update rate when currency changes
    if (rates[currency.code] && currency.code !== 'SAR') {
      setCurrencyState(prev => ({
        ...prev,
        rate: rates[currency.code]
      }));
    }
  }, [rates, currency.code]);

  const setCurrency = (code: CurrencyCode) => {
    const baseRate = rates[code] || fallbackCurrencies[code].rate;
    const newCurrency: Currency = {
      code,
      symbol: fallbackCurrencies[code].symbol,
      rate: baseRate,
      icon: fallbackCurrencies[code].icon,
      image: fallbackCurrencies[code].image,
      name: fallbackCurrencies[code].name
    };
    setCurrencyState(newCurrency);
    localStorage.setItem('levelup-currency', code);
  };

  const formatPrice = (price: number, showIcon: boolean = false): string | JSX.Element => {
    const convertedPrice = (price * currency.rate).toFixed(2);
    if (showIcon) {
      return (
        <span className="flex items-center gap-1">
          <img src={currency.image} alt={currency.name} className="w-5 h-5" />
          <span>{convertedPrice} {currency.symbol}</span>
        </span>
      );
    }
    return `${convertedPrice} ${currency.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isLoading }}>
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
