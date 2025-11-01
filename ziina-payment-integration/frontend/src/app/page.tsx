import Link from 'next/link';
import { CreditCard, Shield, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-ziina-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Secure Payment Processing
            <span className="block text-ziina-600">with Ziina</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Fast, secure, and reliable payment processing for your business. 
            Accept payments from customers worldwide with confidence.
          </p>
          <div className="mt-10">
            <Link
              href="/checkout"
              className="btn-ziina text-lg px-8 py-3 animate-pulse-slow"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Start Payment
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Our Payment Solution?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Built with security, speed, and reliability in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Security */}
          <div className="card text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ziina-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-ziina-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Bank-Level Security
            </h3>
            <p className="text-gray-600">
              Your payments are protected with industry-leading encryption 
              and security protocols. PCI DSS compliant.
            </p>
          </div>

          {/* Speed */}
          <div className="card text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Process payments in seconds with our optimized infrastructure. 
              Real-time transaction updates and notifications.
            </p>
          </div>

          {/* Reliability */}
          <div className="card text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              99.9% Uptime
            </h3>
            <p className="text-gray-600">
              Reliable payment processing with minimal downtime. 
              24/7 monitoring and instant failover protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Try our payment system now - it only takes a few seconds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="btn-ziina text-lg px-8 py-3"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Make a Payment
              </Link>
              <Link
                href="/demo"
                className="btn-outline text-lg px-8 py-3"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-ziina-400 mb-2">$10M+</div>
              <div className="text-gray-300">Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ziina-400 mb-2">50K+</div>
              <div className="text-gray-300">Transactions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ziina-400 mb-2">99.9%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ziina-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
