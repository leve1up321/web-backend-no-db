import { useLanguage } from '@/contexts/LanguageContext';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

const ProductsGrid = () => {
  const { t } = useLanguage();

  return (
    <section id="products" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('ourProducts')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('productsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
