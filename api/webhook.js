import { verifyWebhookSignature } from '../lib/ziina.js';
import { updateOrder, findOrder } from '../lib/database.js';
import { sendOrderConfirmationEmail } from '../lib/email.js';

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-ziina-signature'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = verifyWebhookSignature(payload, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event_type, data } = req.body;
    console.log('Webhook received:', event_type, data?.id);

    if (event_type === 'payment_intent.succeeded') {
      const paymentIntent = data;
      
      // Find the order
      const orderResult = await findOrder({ id: paymentIntent.id });
      if (!orderResult.success) {
        console.error('Order not found:', paymentIntent.id);
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderResult.order;

      // Update order status
      const updateResult = await updateOrder(paymentIntent.id, {
        status: 'completed',
        paidAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });

      if (!updateResult.success) {
        console.error('Failed to update order:', updateResult.error);
        return res.status(500).json({ error: 'Failed to update order' });
      }

      // Parse items if it's a cart order
      let items = null;
      if (paymentIntent.metadata?.items) {
        try {
          items = JSON.parse(paymentIntent.metadata.items);
        } catch (e) {
          console.error('Failed to parse items:', e);
        }
      }

      // Send confirmation email
      const emailResult = await sendOrderConfirmationEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        orderNumber: order.orderNumber,
        productName: order.productName,
        items: items,
        amount: order.amount,
        currency: order.currency,
        downloadLink: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?orderId=${order.id}`
      });

      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error);
        // Don't fail the webhook for email issues
      }

      console.log('✅ Payment processed successfully:', order.orderNumber);
      return res.status(200).json({ success: true });
    }

    if (event_type === 'payment_intent.payment_failed') {
      const paymentIntent = data;
      
      // Update order status to failed
      const updateResult = await updateOrder(paymentIntent.id, {
        status: 'failed'
      });

      if (!updateResult.success) {
        console.error('Failed to update failed order:', updateResult.error);
      }

      console.log('❌ Payment failed:', paymentIntent.id);
      return res.status(200).json({ success: true });
    }

    // Handle other event types if needed
    console.log('Unhandled webhook event:', event_type);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
