import Link from 'next/link';
import { CheckCircle, ArrowLeft, Receipt, Mail } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ziina-50 to-green-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ziina-100 rounded-full mb-6 animate-pulse-slow">
            <CheckCircle className="w-12 h-12 text-ziina-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your payment has been processed successfully
          </p>
        </div>

        {/* Success Card */}
        <div className="card mb-8">
          <div className="card-body text-center py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-ziina-600">
                <Receipt className="w-5 h-5" />
                <span className="font-medium">Transaction Complete</span>
              </div>
              
              <p className="text-gray-600">
                Thank you for your payment. You should receive a confirmation 
                email shortly with your transaction details.
              </p>

              <div className="bg-ziina-50 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-center space-x-2 text-ziina-700">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Confirmation email sent
                  </span>
                </div>
                <p className="text-xs text-ziina-600 mt-1">
                  Check your inbox for payment receipt
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              What happens next?
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ziina-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-ziina-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Email Confirmation
                  </p>
                  <p className="text-xs text-gray-600">
                    You'll receive a detailed receipt via email
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ziina-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-ziina-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Processing
                  </p>
                  <p className="text-xs text-gray-600">
                    Your payment is being processed securely
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-ziina-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-ziina-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Completion
                  </p>
                  <p className="text-xs text-gray-600">
                    You'll be notified once everything is complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full btn-ziina text-center py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </Link>
          
          <Link
            href="/checkout"
            className="w-full btn-outline text-center py-3"
          >
            Make Another Payment
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Questions about your payment?
          </p>
          <a 
            href="mailto:support@example.com" 
            className="text-ziina-600 hover:text-ziina-700 text-sm font-medium"
          >
            Contact Support
          </a>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              Your payment was processed securely
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 SSL Encrypted</span>
              <span>💳 PCI Compliant</span>
              <span>⚡ Ziina Secured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
