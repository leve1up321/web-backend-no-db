import React from 'react';

interface PaymentMethod {
  name: string;
  logo: string;
  alt: string;
}

const PaymentMethods: React.FC = () => {
  const paymentMethods: PaymentMethod[] = [
    { name: 'Mastercard', logo: '/payment-methods/mastercard.svg', alt: 'Mastercard' },
    { name: 'Visa', logo: '/payment-methods/visa.svg', alt: 'Visa' },
    { name: 'Google Pay', logo: '/payment-methods/google-pay.svg', alt: 'Google Pay' },
    { name: 'PayPal', logo: '/payment-methods/paypal.svg', alt: 'PayPal' },
  ];

  return (
    <div className="py-8 border-t border-border">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold mb-4 text-foreground">
          طرق الدفع المتاحة
        </h4>
        <p className="text-sm text-muted-foreground mb-6">
          ندعم جميع طرق الدفع الآمنة والموثوقة
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        {paymentMethods.map((method) => (
          <div 
            key={method.name}
            className="group transition-all duration-300 hover:scale-105"
            title={method.alt}
          >
            <img 
              src={method.logo} 
              alt={method.alt} 
              className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          🔒 جميع المعاملات محمية بتشفير SSL 256-bit
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
