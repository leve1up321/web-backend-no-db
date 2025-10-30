import { User } from '../../models/User.js';
import { hashPassword, generateToken, isValidEmail, isValidPassword, sanitizeUser } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { name, email, password, phone, address, city } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
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
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create user
    const newUser = await User.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name
    });

    // Return success response with user data and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: sanitizeUser(newUser),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
}
