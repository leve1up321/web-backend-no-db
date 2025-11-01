'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreditCard, Loader2, Shield, Lock } from 'lucide-react';
import { createPayment } from '@/lib/api';

interface PaymentFormData {
  name: string;
  email: string;
  amount: number;
  currency: string;
  description?: string;
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    defaultValues: {
      currency: 'AED',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Submitting payment data:', data);
      
      const response = await createPayment(data);
      
      if (response.success && response.payment_url) {
        toast.success('Payment link created! Redirecting...');
        
        // Redirect to Ziina payment page
        window.location.href = response.payment_url;
      } else {
        throw new Error(response.error || 'Failed to create payment');
      }
    } catch (error: any) {
      console.error('Payment creation failed:', error);
      toast.error(error.message || 'Failed to create payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ziina-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-ziina-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Secure Checkout
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your payment details below
          </p>
        </div>

        {/* Payment Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              All fields are required for processing
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Name cannot exceed 100 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max="100000"
                  className={`form-input ${errors.amount ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="0.00"
                  {...register('amount', {
                    required: 'Amount is required',
                    min: {
                      value: 1,
                      message: 'Amount must be at least 1',
                    },
                    max: {
                      value: 100000,
                      message: 'Amount cannot exceed 100,000',
                    },
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="form-label">
                  Currency
                </label>
                <select
                  id="currency"
                  className="form-input"
                  {...register('currency', { required: 'Currency is required' })}
                >
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>

            {/* Description Field (Optional) */}
            <div>
              <label htmlFor="description" className="form-label">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                className="form-input"
                placeholder="What is this payment for?"
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description cannot exceed 500 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-ziina-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">
                    Your payment is secure
                  </p>
                  <p className="text-gray-600">
                    We use bank-level encryption to protect your information. 
                    Your card details are processed securely by Ziina.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-ziina text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Payment Link...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Pay with Ziina
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="card-footer">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                SSL Secured
              </span>
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                PCI Compliant
              </span>
              <span className="flex items-center">
                ⚡ Powered by Ziina
              </span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-ziina-600 hover:text-ziina-700">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
