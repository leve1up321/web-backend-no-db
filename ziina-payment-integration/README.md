# Ziina Payment Gateway Integration

A complete payment integration solution with Next.js frontend (Vercel) and Express.js backend (Railway).

## 🏗️ Project Structure

```
ziina-payment-integration/
├── frontend/                 # Next.js 14 + TypeScript (Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── checkout/
│   │   │   ├── success/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
├── backend/                  # Express.js + Node.js (Railway)
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Quick Start

### 1. Backend Setup (Railway)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Ziina credentials
npm run dev
```

### 2. Frontend Setup (Vercel)

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
ZIINA_SECRET_KEY=your_ziina_secret_key
ZIINA_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

## 📦 Deployment

### Deploy Backend to Railway

1. Create a new Railway project
2. Connect your GitHub repository
3. Set root directory to `ziina-payment-integration/backend`
4. Add environment variables in Railway dashboard:
   - `ZIINA_SECRET_KEY`
   - `ZIINA_WEBHOOK_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
5. Deploy automatically

### Deploy Frontend to Vercel

1. Connect your GitHub repository to Vercel
2. Set root directory to `ziina-payment-integration/frontend`
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL)
4. Deploy automatically

**Important:** Make sure to update the `NEXT_PUBLIC_API_URL` in your frontend environment variables with your actual Railway backend URL after deployment.

## 🔒 Security Features

- CORS protection
- Helmet security headers
- Environment variable validation
- Webhook signature verification
- Input validation and sanitization

## 🧪 Testing

1. Use Ziina test mode for development
2. Test webhook with ngrok for local development
3. Use Postman to test API endpoints

## 📚 API Documentation

### POST /api/pay
Creates a payment link with Ziina

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "payment_url": "https://ziina.com/pay/xxx",
  "payment_id": "pay_xxx"
}
```

### POST /webhook/ziina
Handles Ziina webhook events

**Headers:**
- `x-ziina-signature`: Webhook signature

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js, TypeScript
- **Deployment:** Vercel (Frontend), Railway (Backend)
- **Payment:** Ziina Payment Gateway
