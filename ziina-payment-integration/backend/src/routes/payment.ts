import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validatePaymentRequest, rateLimiter, sanitizeInput } from '../middleware/validation';
import { ziinaClient } from '../utils/ziinaClient';
import { PaymentRequest, PaymentResponse, ZiinaPaymentRequest } from '../types';

const router = Router();

// Apply middleware
router.use(sanitizeInput);
router.use(rateLimiter(15 * 60 * 1000, 50)); // 50 requests per 15 minutes

/**
 * POST /api/pay
 * Create a payment link with Ziina
 */
router.post('/pay', validatePaymentRequest, asyncHandler(async (req: Request, res: Response) => {
  const { name, email, amount, currency = 'AED', description }: PaymentRequest = req.body;

  console.log('💳 Creating payment for:', { name, email, amount, currency });

  try {
    // Prepare Ziina payment request
    const ziinaPaymentData: ZiinaPaymentRequest = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      description: description || `Payment from ${name}`,
      customer: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      webhook_url: `${req.protocol}://${req.get('host')}/webhook/ziina`,
    };

    // Create payment with Ziina
    const ziinaResponse = await ziinaClient.createPayment(ziinaPaymentData);

    console.log('✅ Payment created successfully:', ziinaResponse.id);

    // Prepare response
    const response: PaymentResponse = {
      success: true,
      payment_url: ziinaResponse.payment_url,
      payment_id: ziinaResponse.id,
      message: 'Payment link created successfully',
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('❌ Payment creation failed:', error.message);
    
    throw new AppError(
      error.message || 'Failed to create payment link',
      error.statusCode || 500
    );
  }
}));

/**
 * GET /api/payment/:id
 * Get payment details
 */
router.get('/payment/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Payment ID is required', 400);
  }

  console.log('🔍 Retrieving payment:', id);

  try {
    const payment = await ziinaClient.getPayment(id);

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment retrieved successfully',
    });
  } catch (error: any) {
    console.error('❌ Failed to retrieve payment:', error.message);
    
    throw new AppError(
      error.message || 'Failed to retrieve payment',
      error.statusCode || 404
    );
  }
}));

/**
 * POST /api/payment/:id/cancel
 * Cancel a payment
 */
router.post('/payment/:id/cancel', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Payment ID is required', 400);
  }

  console.log('❌ Cancelling payment:', id);

  try {
    const result = await ziinaClient.cancelPayment(id);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment cancelled successfully',
    });
  } catch (error: any) {
    console.error('❌ Failed to cancel payment:', error.message);
    
    throw new AppError(
      error.message || 'Failed to cancel payment',
      error.statusCode || 400
    );
  }
}));

/**
 * POST /api/payment/:id/refund
 * Refund a payment
 */
router.post('/payment/:id/refund', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, reason } = req.body;

  if (!id) {
    throw new AppError('Payment ID is required', 400);
  }

  console.log('💰 Refunding payment:', { id, amount, reason });

  try {
    const result = await ziinaClient.refundPayment(id, amount, reason);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Payment refunded successfully',
    });
  } catch (error: any) {
    console.error('❌ Failed to refund payment:', error.message);
    
    throw new AppError(
      error.message || 'Failed to refund payment',
      error.statusCode || 400
    );
  }
}));

export default router;
