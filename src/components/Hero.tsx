import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
      {/* خلفية الهيرو بالتدرج */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] via-[#5C00B2] to-background opacity-20 animate-gradient-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#8C00FF]/10 to-[#00FFD1]/10 animate-gradient-reverse"></div>
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary-light bg-clip-text text-transparent animate-gradient">
              {t('heroTitle')}
            </span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-foreground/90">
            {t('heroSubtitle')}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-neon"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('startJourney')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary hover:bg-primary/10 text-lg px-8 py-6"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('shopNow')}
            </Button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .shadow-neon {
          box-shadow: var(--shadow-neon);
        }
        
        .shadow-neon:hover {
          box-shadow: var(--shadow-neon-hover);
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-reverse {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradient-slow 8s ease infinite;
        }
        
        .animate-gradient-reverse {
          background-size: 400% 400%;
          animation: gradient-reverse 12s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
