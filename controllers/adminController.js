import bcrypt from 'bcryptjs';
import Admins from '../models/adminModel.js';
import { createTokens, verifyToken } from '../utils/jwt.js';

export const registerAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const existingAdmin = await Admins.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admins.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      adminId: admin._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register admin'
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = createTokens(admin._id, admin.email);

    res.json({
      success: true,
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const { valid, expired, decoded } = verifyToken(refresh_token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: expired ? 'Refresh token has expired' : 'Invalid refresh token'
      });
    }

    const { accessToken, refreshToken } = createTokens(decoded.userId, decoded.email);

    res.json({
      success: true,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.userId; // Get admin ID from authenticated token

    const admin = await Admins.findById(adminId).select('-password'); // Exclude password
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        fullName: admin.fullName,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
    });
  }
};