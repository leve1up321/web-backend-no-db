import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsGrid from '@/components/ProductsGrid';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProductsGrid />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
