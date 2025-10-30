import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

const ProductsGrid = () => {
  const { t } = useLanguage();

  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('ourProducts')}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            {t('productsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
