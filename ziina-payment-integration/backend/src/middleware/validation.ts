import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    amount: Joi.number().positive().min(1).max(100000).required().messages({
      'number.positive': 'Amount must be a positive number',
      'number.min': 'Amount must be at least 1',
      'number.max': 'Amount cannot exceed 100,000',
      'any.required': 'Amount is required'
    }),
    currency: Joi.string().valid('AED', 'SAR', 'USD').default('AED').messages({
      'any.only': 'Currency must be one of: AED, SAR, USD'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'Description cannot exceed 500 characters'
    })
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    throw new AppError(errorMessage, 400);
  }

  // Replace request body with validated data
  req.body = value;
  next();
};

export const validateWebhookSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.get('x-ziina-signature') || req.get('X-Ziina-Signature');
  
  if (!signature) {
    throw new AppError('Missing webhook signature', 401);
  }

  // Store signature for later verification
  req.body.signature = signature;
  next();
};

export const rateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  const requests = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId).filter((time: number) => time > windowStart);
      requests.set(clientId, clientRequests);
    }

    // Check rate limit
    const clientRequests = requests.get(clientId) || [];
    if (clientRequests.length >= max) {
      throw new AppError('Too many requests, please try again later', 429);
    }

    // Add current request
    clientRequests.push(now);
    requests.set(clientId, clientRequests);

    next();
  };
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic input sanitization
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};
