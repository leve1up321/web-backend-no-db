import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Eye, ShoppingBag } from 'lucide-react';

const StoreStats = () => {
  // تحميل الأرقام من localStorage أو استخدام القيم الافتراضية
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('levelup-store-stats');
    if (savedStats) {
      return JSON.parse(savedStats);
    }
    return {
      customers: 350,
      visitors: 2500,
      sales: 600
    };
  });

  const [lastUpdate, setLastUpdate] = useState(() => {
    const saved = localStorage.getItem('levelup-store-last-update');
    return saved ? parseInt(saved) : Date.now();
  });

  useEffect(() => {
    // حفظ الإحصائيات في localStorage عند تغييرها
    localStorage.setItem('levelup-store-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    let customersInterval: NodeJS.Timeout;
    let visitorsInterval: NodeJS.Timeout;
    let salesInterval: NodeJS.Timeout;

    // زيادة العملاء كل 15-25 ثانية
    const startCustomersInterval = () => {
      customersInterval = setInterval(() => {
        setStats(prevStats => {
          const newStats = {
            ...prevStats,
            customers: prevStats.customers + 1
          };
          localStorage.setItem('levelup-store-stats', JSON.stringify(newStats));
          return newStats;
        });
      }, Math.random() * 10000 + 15000); // 15-25 ثانية
    };

    // زيادة الزوار كل 5-10 ثواني
    const startVisitorsInterval = () => {
      visitorsInterval = setInterval(() => {
        setStats(prevStats => {
          const newStats = {
            ...prevStats,
            visitors: prevStats.visitors + Math.floor(Math.random() * 3) + 1 // زيادة 1-3
          };
          localStorage.setItem('levelup-store-stats', JSON.stringify(newStats));
          return newStats;
        });
      }, Math.random() * 5000 + 5000); // 5-10 ثواني
    };

    // زيادة المبيعات كل 45-90 ثانية (بطيء جداً)
    const startSalesInterval = () => {
      salesInterval = setInterval(() => {
        setStats(prevStats => {
          const newStats = {
            ...prevStats,
            sales: prevStats.sales + 1
          };
          localStorage.setItem('levelup-store-stats', JSON.stringify(newStats));
          return newStats;
        });
      }, Math.random() * 45000 + 45000); // 45-90 ثانية
    };

    // بدء التحديثات بتأخيرات مختلفة
    setTimeout(startCustomersInterval, 5000); // يبدأ بعد 5 ثواني
    setTimeout(startVisitorsInterval, 2000); // يبدأ بعد ثانيتين
    setTimeout(startSalesInterval, 30000); // يبدأ بعد 30 ثانية

    return () => {
      clearInterval(customersInterval);
      clearInterval(visitorsInterval);
      clearInterval(salesInterval);
    };
  }, []);

  const statsData = [
    {
      icon: Users,
      value: stats.customers,
      label: 'عميل راضي',
      suffix: '+',
      color: 'text-blue-500'
    },
    {
      icon: Eye,
      value: stats.visitors,
      label: 'زائر شهرياً',
      suffix: '+',
      color: 'text-green-500'
    },
    {
      icon: ShoppingBag,
      value: stats.sales,
      label: 'عملية بيع',
      suffix: '+',
      color: 'text-purple-500'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              إحصائيات متجر Level Up
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            أرقام حقيقية تتحدث عن نفسها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-lg font-semibold text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreStats;
