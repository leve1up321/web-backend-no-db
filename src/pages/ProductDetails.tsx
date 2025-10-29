import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, Shield, Heart, Users } from 'lucide-react';
import { products } from '@/data/products';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { sanitizeHtml } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import BuyNowButton from '@/components/BuyNowButton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <Link to="/">
            <Button>{t('backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }



  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.title}
                className="w-full rounded-2xl shadow-2xl border border-border"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-4">{product.category}</Badge>
                <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviewsCount} {t('reviews')})
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{product.purchaseCount} مشترٍ</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <BuyNowButton 
                    product={product} 
                    size="lg" 
                    className="flex-1 text-lg py-6"
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 py-6 border-primary/50 hover:bg-primary/10"
                    onClick={handleWishlistToggle}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        isInWishlist(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <Card className="bg-card/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('features')}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              {(product.pages || product.readingTime) && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {product.pages && <span>📄 {product.pages}</span>}
                  {product.readingTime && <span>⏱️ {product.readingTime}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-12">
            <Card className="bg-card/50">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">
                  {t('productDescription')}
                </h2>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.fullDescription) }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-12">
              <Card className="bg-card/50">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">
                    تقييمات العملاء ({product.reviews.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.reviews.map((review) => (
                      <Card key={review.id} className="bg-background/50 border-primary/20">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{review.name}</span>
                              {review.verified && (
                                <Shield className="h-4 w-4 text-green-500" title="مشترٍ موثق" />
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Similar Products */}
          <div className="mt-12">
            <Card className="bg-card/50">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">
                  منتجات مشابهة
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products
                    .filter(p => p.id !== product.id)
                    .slice(0, 2)
                    .map((similarProduct) => (
                      <Card key={similarProduct.id} className="bg-background/50 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <img
                              src={similarProduct.image}
                              alt={similarProduct.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                {similarProduct.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{similarProduct.rating}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ({similarProduct.reviewsCount})
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(similarProduct.price)}
                                </span>
                                <Link to={`/product/${similarProduct.id}`}>
                                  <Button size="sm" variant="outline">
                                    عرض التفاصيل
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
