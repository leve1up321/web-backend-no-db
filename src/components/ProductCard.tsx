import { Star, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '@/data/products';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveRating from '@/components/InteractiveRating';
import BuyNowButton from '@/components/BuyNowButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg rounded-xl">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
          />
          <Badge className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary/90 text-xs sm:text-sm">
            {product.category}
          </Badge>
          
          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 sm:top-4 left-2 sm:left-4 p-1.5 sm:p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 hover:scale-110 group/heart"
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ${
                isInWishlist(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted-foreground group-hover/heart:text-red-500'
              }`}
            />
          </button>
        </div>
      </Link>
      
      <CardContent className="p-3 sm:p-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base sm:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 text-center sm:text-left">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
          <InteractiveRating
            initialRating={product.rating}
            readonly={false}
            size="sm"
            showValue={false}
            onRatingChange={(newRating) => {
              console.log(`Product rating changed to: ${newRating} for ${product.title}`);
            }}
          />
          <span className="text-muted-foreground text-xs sm:text-sm">
            ({product.reviewsCount})
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
        <span className="text-lg sm:text-xl font-bold text-primary text-center">
          {formatPrice(product.price)}
        </span>
        
        <div className="w-full sm:w-auto">
          <BuyNowButton product={product} size="sm" className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-shadow" />
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
