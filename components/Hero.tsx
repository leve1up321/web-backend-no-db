"use client"

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>مرحباً بك في Level Up Store</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="block text-foreground">متجرك الإلكتروني</span>
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              للمنتجات الرقمية
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من المنتجات الرقمية عالية الجودة والخدمات المتميزة التي تلبي احتياجاتك
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="group inline-flex items-center space-x-2 space-x-reverse bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <span>تصفح المنتجات</span>
              <ArrowRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 space-x-reverse border border-input bg-background px-8 py-3 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>تعرف علينا</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">منتج متاح</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground">عميل راضٍ</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">دعم فني</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

