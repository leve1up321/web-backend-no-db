"use client"

import Link from 'next/link'
import { Mail, MessageCircle, Instagram, Target } from 'lucide-react'

export function ContactSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">اتصل بنا</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحب أن نسمع منك!
          </p>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            لا تتردد في التواصل معنا عبر أي من الطرق التالية. فريق الدعم جاهز لمساعدتك في كل خطوة من رحلتك الرقمية
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <a
            href="mailto:leve1up999q@gmail.com"
            className="group bg-card border-2 border-border hover:border-purple-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">البريد الإلكتروني</h3>
            <p className="text-purple-600 font-medium">leve1up999q@gmail.com</p>
          </a>

          <a
            href="https://wa.me/971503492848"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border-2 border-border hover:border-purple-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">واتساب</h3>
            <p className="text-purple-600 font-medium">+971503492848</p>
          </a>

          <a
            href="https://instagram.com/lvlup3211"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border-2 border-border hover:border-purple-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">انستغرام</h3>
            <p className="text-purple-600 font-medium">@lvlup3211</p>
          </a>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Target className="h-12 w-12" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              🎯 جاهز للبدء؟
            </h3>
            <p className="text-xl mb-8 opacity-90">
              كل يوم تأجّله هو فرصة ضائعة! ابدأ مشروعك الرقمي اليوم واحصل على دخلك الأول
            </p>
            <Link
              href="#products"
              className="inline-block bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

