"use client"

import { ShoppingCart, Star } from 'lucide-react'

// Sample products data
const products = [
  {
    id: 1,
    name: "منتج رقمي 1",
    description: "وصف قصير للمنتج الرقمي الأول",
    price: 99.99,
    rating: 4.5,
    image: "/placeholder-product.jpg"
  },
  {
    id: 2,
    name: "منتج رقمي 2",
    description: "وصف قصير للمنتج الرقمي الثاني",
    price: 149.99,
    rating: 4.8,
    image: "/placeholder-product.jpg"
  },
  {
    id: 3,
    name: "منتج رقمي 3",
    description: "وصف قصير للمنتج الرقمي الثالث",
    price: 79.99,
    rating: 4.3,
    image: "/placeholder-product.jpg"
  },
  {
    id: 4,
    name: "منتج رقمي 4",
    description: "وصف قصير للمنتج الرقمي الرابع",
    price: 199.99,
    rating: 4.9,
    image: "/placeholder-product.jpg"
  },
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Product Image */}
          <div className="aspect-square bg-secondary/50 flex items-center justify-center">
            <div className="text-4xl">🎁</div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Rating */}
            <div className="flex items-center space-x-1 space-x-reverse">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {product.price} <span className="text-sm">ر.س</span>
                </div>
              </div>

              <button className="bg-primary text-primary-foreground p-3 rounded-md hover:bg-primary/90 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sale Badge (optional) */}
          {product.id === 2 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              تخفيض
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

