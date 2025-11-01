import { hashPassword, generateToken, isValidEmail, isValidPassword, sanitizeUser } from '../../lib/auth.js';
import { connectDB } from '../../lib/mongodb.js';

export default async function (req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'طريقة غير مدعومة - يُسمح فقط بـ POST'
    });
  }

  try {
    const { name, email, password, phone, address, city } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'صيغة البريد الإلكتروني غير صحيحة'
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم'
      });
    }

    // Connect to database
    const { db } = await connectDB();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'المستخدم موجود بالفعل بهذا البريد الإلكتروني'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      city: city?.trim() || '',
      country: 'UAE',
      isEmailVerified: false,
      isActive: true,
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        totalReviews: 0,
        averageRating: 0
      },
      preferences: {
        language: 'ar',
        currency: 'AED',
        notifications: {
          email: true,
          sms: false,
          push: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(userData);
    const newUser = { ...userData, _id: result.insertedId };

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: sanitizeUser(newUser),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطأ في الخادم - يرجى المحاولة لاحقاً'
    });
  }
}
