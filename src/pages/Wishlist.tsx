import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveRating from '@/components/InteractiveRating';
import BuyNowButton from '@/components/BuyNowButton';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      rating: product.rating
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">قائمة الأمنيات فارغة</h1>
              <p className="text-muted-foreground mb-8">
                لم تقم بإضافة أي منتجات إلى قائمة الأمنيات بعد. ابدأ بتصفح منتجاتنا المميزة!
              </p>
            </div>
            
            <Link to="/">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <div>
              <h1 className="text-3xl font-bold">قائمة الأمنيات</h1>
              <p className="text-muted-foreground">
                {wishlist.length} منتج في قائمة الأمنيات
              </p>
            </div>
          </div>
          
          {wishlist.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              مسح الكل
            </Button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
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
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 hover:scale-110 group/heart"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500 transition-all duration-200" />
                  </button>
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
                
                {/* Interactive Rating */}
                <InteractiveRating
                  initialRating={product.rating}
                  readonly={false}
                  size="sm"
                  showValue={true}
                  onRatingChange={(newRating) => {
                    console.log(`Rating changed for ${product.title}: ${newRating}`);
                  }}
                />
              </CardContent>
              
              <CardFooter className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>
                
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف للسلة
                  </Button>
                  <BuyNowButton product={product} size="sm" className="flex-1" />
                </div>
              </CardFooter>
              
              <style>{`
                .shadow-neon {
                  box-shadow: var(--shadow-neon);
                }
              `}</style>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
