import { ShoppingCart, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { type Product } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-primary/90 text-xs sm:text-sm">
            {product.category}
          </Badge>
        </div>
      </Link>
      
      <CardContent className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
          </div>
          <span className="text-muted-foreground">
            ({product.reviewsCount} {t('reviews')})
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{product.purchaseCount} مشترٍ</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 md:p-6 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
        <span className="text-xl sm:text-2xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to={`/product/${product.id}`} className="flex-1 sm:flex-none">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              {t('viewDetails')}
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-3 sm:px-4"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardFooter>
      
      <style>{`
        .shadow-neon {
          box-shadow: var(--shadow-neon);
        }
      `}</style>
    </Card>
  );
};

export default ProductCard;
