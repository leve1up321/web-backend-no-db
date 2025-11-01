import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validateWebhookSignature, rateLimiter } from '../middleware/validation';
import { ziinaClient } from '../utils/ziinaClient';
import { ZiinaWebhookPayload } from '../types';

const router = Router();

// Apply rate limiting for webhooks
router.use(rateLimiter(5 * 60 * 1000, 100)); // 100 requests per 5 minutes

/**
 * POST /webhook/ziina
 * Handle Ziina webhook events
 */
router.post('/ziina', validateWebhookSignature, asyncHandler(async (req: Request, res: Response) => {
  const signature = req.get('x-ziina-signature') || req.get('X-Ziina-Signature');
  const rawBody = req.body;

  console.log('🔔 Received Ziina webhook');

  try {
    // Verify webhook signature
    const isValidSignature = ziinaClient.verifyWebhookSignature(
      JSON.stringify(rawBody),
      signature!
    );

    if (!isValidSignature) {
      console.error('❌ Invalid webhook signature');
      throw new AppError('Invalid webhook signature', 401);
    }

    console.log('✅ Webhook signature verified');

    // Parse webhook payload
    const payload: ZiinaWebhookPayload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

    console.log('📦 Webhook payload:', {
      id: payload.id,
      type: payload.type,
      payment_id: payload.data?.payment?.id,
      status: payload.data?.payment?.status,
    });

    // Handle different webhook events
    await handleWebhookEvent(payload);

    // Respond with 200 OK to acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      event_id: payload.id,
    });

  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error.message);
    
    // Still return 200 to prevent Ziina from retrying
    // Log the error for investigation
    res.status(200).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
}));

/**
 * Handle different types of webhook events
 */
async function handleWebhookEvent(payload: ZiinaWebhookPayload): Promise<void> {
  const { type, data } = payload;
  const payment = data.payment;

  switch (type) {
    case 'payment.succeeded':
      console.log('✅ Payment succeeded:', payment.id);
      await handlePaymentSucceeded(payment);
      break;

    case 'payment.failed':
      console.log('❌ Payment failed:', payment.id);
      await handlePaymentFailed(payment);
      break;

    case 'payment.cancelled':
      console.log('🚫 Payment cancelled:', payment.id);
      await handlePaymentCancelled(payment);
      break;

    case 'payment.refunded':
      console.log('💰 Payment refunded:', payment.id);
      await handlePaymentRefunded(payment);
      break;

    case 'payment.pending':
      console.log('⏳ Payment pending:', payment.id);
      await handlePaymentPending(payment);
      break;

    default:
      console.log('❓ Unknown webhook event type:', type);
      break;
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(payment: any): Promise<void> {
  console.log('🎉 Processing successful payment:', {
    id: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    customer: payment.customer.email,
  });

  // TODO: Implement your business logic here
  // Examples:
  // - Update database with payment status
  // - Send confirmation email to customer
  // - Fulfill order
  // - Update inventory
  // - Trigger other services

  // Example database update (uncomment when you have a database)
  /*
  await updatePaymentStatus(payment.id, 'completed', {
    amount: payment.amount,
    currency: payment.currency,
    customer_email: payment.customer.email,
    completed_at: new Date(),
  });
  */

  // Example email notification (uncomment when you have email service)
  /*
  await sendPaymentConfirmationEmail({
    to: payment.customer.email,
    name: payment.customer.name,
    amount: payment.amount,
    currency: payment.currency,
    payment_id: payment.id,
  });
  */
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(payment: any): Promise<void> {
  console.log('💔 Processing failed payment:', {
    id: payment.id,
    customer: payment.customer.email,
  });

  // TODO: Implement your business logic here
  // Examples:
  // - Update database with failure status
  // - Send failure notification to customer
  // - Log for analytics
  // - Retry payment if applicable

  // Example database update
  /*
  await updatePaymentStatus(payment.id, 'failed', {
    failed_at: new Date(),
    failure_reason: 'Payment processing failed',
  });
  */
}

/**
 * Handle cancelled payment
 */
async function handlePaymentCancelled(payment: any): Promise<void> {
  console.log('🚫 Processing cancelled payment:', {
    id: payment.id,
    customer: payment.customer.email,
  });

  // TODO: Implement your business logic here
  // Examples:
  // - Update database with cancelled status
  // - Release reserved inventory
  // - Send cancellation notification

  // Example database update
  /*
  await updatePaymentStatus(payment.id, 'cancelled', {
    cancelled_at: new Date(),
  });
  */
}

/**
 * Handle refunded payment
 */
async function handlePaymentRefunded(payment: any): Promise<void> {
  console.log('💰 Processing refunded payment:', {
    id: payment.id,
    customer: payment.customer.email,
  });

  // TODO: Implement your business logic here
  // Examples:
  // - Update database with refund status
  // - Update inventory
  // - Send refund confirmation email
  // - Process returns

  // Example database update
  /*
  await updatePaymentStatus(payment.id, 'refunded', {
    refunded_at: new Date(),
  });
  */
}

/**
 * Handle pending payment
 */
async function handlePaymentPending(payment: any): Promise<void> {
  console.log('⏳ Processing pending payment:', {
    id: payment.id,
    customer: payment.customer.email,
  });

  // TODO: Implement your business logic here
  // Examples:
  // - Update database with pending status
  // - Set up monitoring for status changes
  // - Send pending notification to customer

  // Example database update
  /*
  await updatePaymentStatus(payment.id, 'pending', {
    pending_since: new Date(),
  });
  */
}

/**
 * GET /webhook/test
 * Test endpoint to verify webhook is working
 */
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Webhook endpoint is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
