import { Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BuyNowButton from '@/components/BuyNowButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className="absolute top-4 right-4 bg-primary/90">
            {product.category}
          </Badge>
        </div>
      </Link>
      
      <CardContent className="p-6 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
          </div>
          <span className="text-muted-foreground">
            ({product.reviewsCount} {t('reviews')})
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{product.purchaseCount} مشترٍ</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        
        <div className="flex gap-2">
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="sm">
              {t('viewDetails')}
            </Button>
          </Link>
          <BuyNowButton product={product} size="sm" />
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
