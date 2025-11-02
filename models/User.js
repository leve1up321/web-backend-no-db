import { getCollection } from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.phone = userData.phone || '';
    this.address = userData.address || '';
    this.city = userData.city || '';
    this.country = userData.country || 'UAE';
    this.dateOfBirth = userData.dateOfBirth || null;
    this.gender = userData.gender || '';
    this.isEmailVerified = userData.isEmailVerified || false;
    this.emailVerificationToken = userData.emailVerificationToken || null;
    this.resetToken = userData.resetToken || null;
    this.resetTokenExpiry = userData.resetTokenExpiry || null;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
    this.lastLoginAt = userData.lastLoginAt || null;
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
    this.preferences = userData.preferences || {
      language: 'ar',
      currency: 'AED',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    };
    this.stats = userData.stats || {
      totalOrders: 0,
      totalSpent: 0,
      totalReviews: 0,
      averageRating: 0
    };
  }

  // Get users collection
  static async getCollection() {
    return await getCollection('users');
  }

  // Create new user
  static async create(userData) {
    const collection = await User.getCollection();
    const user = new User(userData);
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  // Find user by email
  static async findByEmail(email) {
    const collection = await User.getCollection();
    return await collection.findOne({ email: email.toLowerCase() });
  }

  // Find user by ID
  static async findById(id) {
    const collection = await User.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Update user
  static async updateById(id, updateData) {
    const collection = await User.getCollection();
    updateData.updatedAt = new Date();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  // Update user stats
  static async updateStats(userId, stats) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          'stats': stats,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Update last login
  static async updateLastLogin(userId) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Set email verification token
  static async setEmailVerificationToken(userId, token) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          emailVerificationToken: token,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Verify email
  static async verifyEmail(token) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { emailVerificationToken: token },
      { 
        $set: { 
          isEmailVerified: true,
          emailVerificationToken: null,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Set password reset token
  static async setResetToken(email, token, expiry) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          resetToken: token,
          resetTokenExpiry: expiry,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Find user by reset token
  static async findByResetToken(token) {
    const collection = await User.getCollection();
    return await collection.findOne({ 
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });
  }

  // Reset password
  static async resetPassword(token, newPassword) {
    const collection = await User.getCollection();
    const result = await collection.updateOne(
      { 
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }
      },
      { 
        $set: { 
          password: newPassword,
          resetToken: null,
          resetTokenExpiry: null,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Delete user
  static async deleteById(id) {
    const collection = await User.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Get all users (admin only)
  static async findAll(limit = 50, skip = 0) {
    const collection = await User.getCollection();
    return await collection.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Count total users
  static async count() {
    const collection = await User.getCollection();
    return await collection.countDocuments();
  }
}
