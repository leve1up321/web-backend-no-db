"use client"

import Link from 'next/link'
import { Star, Users } from 'lucide-react'

const products = [
  {
    id: 1,
    category: "كتب رقمية",
    title: "15 فكرة مشروع رقمي مربح",
    description: "دليلك العملي لبدء مشروعك الرقمي من الصفر وبناء مصدر دخل حقيقي",
    rating: 4.8,
    reviews: 127,
    buyers: 89,
    price: 57.00,
    link: "/product/1"
  },
  {
    id: 2,
    category: "كتب رقمية",
    title: "الربح من المنتجات الرقمية",
    description: "الخطة الكاملة خطوة بخطوة لتبدأ مشروعك الرقمي الأول وتبني دخل حقيقي",
    rating: 4.6,
    reviews: 89,
    buyers: 67,
    price: 39.00,
    link: "/product/2"
  },
  {
    id: 3,
    category: "كتب رقمية",
    title: "الدليل التمهيدي للربح من المنتجات الرقمية",
    description: "دليل تمهيدي بسيط يساعدك تفهم الخطوات الأساسية لبناء منتج رقمي ناجح - مثالي للمبتدئين",
    rating: 4.3,
    reviews: 45,
    buyers: 34,
    price: 4.00,
    link: "/product/3"
  }
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">منتجاتنا</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اختر الكتاب المناسب لك وابدأ رحلتك نحو النجاح
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-card border-2 border-border hover:border-purple-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
            >
              {/* Product Card */}
              <div className="p-8 space-y-6">
                {/* Category Badge */}
                <div className="inline-block">
                  <span className="bg-purple-600/10 text-purple-600 px-4 py-2 rounded-full text-sm font-medium border border-purple-600/20">
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground leading-tight min-h-[4rem]">
                  {product.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed min-h-[6rem]">
                  {product.description}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center space-x-6 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">{product.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({product.reviews} التقييمات)
                  </div>
                </div>

                {/* Buyers Count */}
                <div className="flex items-center space-x-2 space-x-reverse text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">{product.buyers} مشترٍ</span>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {product.price.toFixed(2)} <span className="text-xl">ر.س</span>
                      </div>
                    </div>
                    <Link
                      href={product.link}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

