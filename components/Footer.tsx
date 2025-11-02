"use client"

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Level Up Store
            </h3>
            <p className="text-sm text-muted-foreground">
              متجرك الموثوق للمنتجات الرقمية والخدمات عالية الجودة
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  سياسة الاسترجاع
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  الدعم الفني
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@levelupstore.com</span>
              </li>
              <li className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+966 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Level Up Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}

