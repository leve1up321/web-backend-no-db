import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory user storage (في التطبيق الحقيقي، استخدم قاعدة بيانات)
const users = new Map();

export default async function handler(req, res) {
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
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'صيغة البريد الإلكتروني غير صحيحة'
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'المستخدم موجود بالفعل بهذا البريد الإلكتروني'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userId = uuidv4();
    const newUser = {
      id: userId,
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Store user (في التطبيق الحقيقي، احفظ في قاعدة البيانات)
    users.set(userId, newUser);

    // Generate simple token (في التطبيق الحقيقي، استخدم JWT)
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          createdAt: newUser.createdAt
        },
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
