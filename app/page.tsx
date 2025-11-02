import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductGrid } from '@/components/ProductGrid'
import { Hero } from '@/components/Hero'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              منتجاتنا المميزة
            </h2>
            <ProductGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

