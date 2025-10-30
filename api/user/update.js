import { User } from '../../models/User.js';
import { requireAuth, sanitizeUser, isValidEmail } from '../../lib/auth.js';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const userId = req.user.userId;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.isEmailVerified;
    delete updateData.resetToken;
    delete updateData.resetTokenExpiry;
    delete updateData.stats;

    // Validate email if provided
    if (updateData.email) {
      if (!isValidEmail(updateData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }

      updateData.email = updateData.email.toLowerCase().trim();
      updateData.isEmailVerified = false; // Reset email verification if email changed
    }

    // Trim string fields
    const stringFields = ['name', 'phone', 'address', 'city', 'country', 'gender'];
    stringFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        updateData[field] = updateData[field].trim();
      }
    });

    // Validate date of birth
    if (updateData.dateOfBirth) {
      const dob = new Date(updateData.dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date of birth format'
        });
      }
      updateData.dateOfBirth = dob;
    }

    // Update user
    const updated = await User.updateById(userId, updateData);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no changes made'
      });
    }

    // Get updated user data
    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: sanitizeUser(updatedUser)
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
}

export default requireAuth(handler);
