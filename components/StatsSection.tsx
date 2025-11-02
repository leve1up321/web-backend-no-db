"use client"

import { Users, Eye, ShoppingCart } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: "350+",
    label: "عميل راضي"
  },
  {
    icon: Eye,
    number: "2,500+",
    label: "زائر شهرياً"
  },
  {
    icon: ShoppingCart,
    number: "600+",
    label: "عملية بيع"
  }
]

export function StatsSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-purple-950/5 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">إحصائيات متجر Level Up</h2>
          <p className="text-xl text-muted-foreground">
            أرقام حقيقية تتحدث عن نفسها
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-card border-2 border-border hover:border-purple-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Number */}
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>

                {/* Label */}
                <div className="text-lg text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

