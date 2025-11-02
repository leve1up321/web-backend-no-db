"use client"

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-purple-950/5 to-background py-20 md:py-32 lg:py-40">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block text-foreground mb-4">متجر لفل اب</span>
          </h1>

          {/* Icon with Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-foreground px-6 py-3 rounded-full text-base font-medium">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span>ابدأ من الصفر وابنِ أول دخل رقمي لك اليوم!</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            حوّل مهاراتك ووقتك إلى دخل حقيقي. انضم لآلاف الأشخاص اللي حققوا حلمهم في العمل الحر والربح من الإنترنت.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="#products"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ابدأ رحلتك الآن
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center justify-center border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 hover:text-white transition-all"
            >
              تسوق الآن
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

