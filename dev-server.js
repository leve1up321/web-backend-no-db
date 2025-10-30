const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// تحميل Vercel Functions محلياً
const createPayment = require('./pages/api/payment/create.js');
const getPaymentStatus = require('./pages/api/payment/status/[paymentId].js');
const webhook = require('./pages/api/payment/webhook.js');

// Routes
app.post('/api/payment/create', createPayment);
app.get('/api/payment/status/:paymentId', (req, res) => {
  req.query = { paymentId: req.params.paymentId };
  getPaymentStatus(req, res);
});
app.post('/api/payment/webhook', webhook);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dev server running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Dev API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/payment/create`);
  console.log(`   GET  http://localhost:${PORT}/api/payment/status/:id`);
  console.log(`   POST http://localhost:${PORT}/api/payment/webhook`);
});
