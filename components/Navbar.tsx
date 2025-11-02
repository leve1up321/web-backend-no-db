"use client"

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Level Up
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              المنتجات
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              من نحن
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              اتصل بنا
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link 
              href="/products" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              المنتجات
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              من نحن
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              اتصل بنا
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

