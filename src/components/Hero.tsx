import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-3 sm:px-4 relative overflow-hidden bg-background">
      {/* خلفية غامقة جداً */}
      <div className="absolute inset-0 bg-background"></div>
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold px-2">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-text">
              {t('heroTitle')}
            </span>
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/90 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default px-4">
            {t('heroSubtitle')}
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-default px-4">
            {t('heroDescription')}
          </p>
          
          <div className="flex flex-col gap-3 sm:gap-4 justify-center pt-6 sm:pt-8 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl rounded-2xl"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('startJourney')}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl transition-all duration-300"
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
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-text {
          background-size: 300% 300%;
          animation: gradient-text 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
