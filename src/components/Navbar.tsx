import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Globe, DollarSign, Menu, X, Heart, User, LogOut, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import CartModal from './CartModal';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const navLinks = [
    { href: '#home', label: t('home') },
    { href: '#products', label: t('products') },
    { href: '#reviews', label: t('reviews') },
    { href: '#faq', label: t('faq') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Level Up Store" 
                className="h-10 object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'block';
                }}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{display: 'none'}}>
                Level Up Store
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-foreground hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'ar' ? 'العربية' : 'English'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">{currency.code}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCurrency('SAR')}>ريال سعودي</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('USD')}>US Dollar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('EUR')}>Euro</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('AED')}>درهم إماراتي</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('EGP')}>جنيه مصري</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">
                      {user ? user.name.split(' ')[0] : 'حسابي'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          الملف الشخصي
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={logout}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          تسجيل الدخول
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          إنشاء حساب
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => {
                          handleNavClick(link.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 text-left"
                      >
                        {link.label}
                      </button>
                    ))}
                    
                    {/* Mobile User Menu */}
                    <div className="border-t pt-4 mt-4">
                      {user ? (
                        <>
                          <div className="text-sm text-muted-foreground mb-2">
                            مرحباً، {user.name}
                          </div>
                          <Link 
                            to="/account" 
                            className="flex items-center gap-2 text-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 mb-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-5 w-5" />
                            الملف الشخصي
                          </Link>
                          <button 
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 text-lg text-red-600 hover:text-red-700 transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            تسجيل الخروج
                          </button>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/login" 
                            className="flex items-center gap-2 text-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300 mb-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-5 w-5" />
                            تسجيل الدخول
                          </Link>
                          <Link 
                            to="/register" 
                            className="flex items-center gap-2 text-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:bg-clip-text hover:text-transparent transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserPlus className="h-5 w-5" />
                            إنشاء حساب
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
