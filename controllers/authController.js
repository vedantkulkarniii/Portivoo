const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword, validateName, sanitizeString } = require('../middleware/validation');
const { authLogger } = require('../middleware/logger');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Generate refresh token (optional future use)
 * @param {string} id - User ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '60d',
  });
};

/**
 * Register user with validation
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate all required fields are present
    if (!name || !email || !password || !confirmPassword) {
      authLogger.register(email || 'unknown', false, 'Missing required fields');
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_FIELDS',
          message: 'Name, email, password, and password confirmation are required',
        },
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      authLogger.register(email, false, 'Passwords do not match');
      return res.status(400).json({
        success: false,
        error: {
          type: 'PASSWORD_MISMATCH',
          message: 'Passwords do not match',
        },
      });
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      authLogger.register(email, false, nameValidation.message);
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_NAME',
          message: nameValidation.message,
        },
      });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      authLogger.register(email, false, emailValidation.message);
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_EMAIL',
          message: emailValidation.message,
        },
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      authLogger.register(emailValidation.value, false, passwordValidation.message);
      return res.status(400).json({
        success: false,
        error: {
          type: 'WEAK_PASSWORD',
          message: passwordValidation.message,
        },
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: emailValidation.value });

    if (userExists) {
      authLogger.register(emailValidation.value, false, 'User already exists');
      return res.status(400).json({
        success: false,
        error: {
          type: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    // Create user
    const user = await User.create({
      name: nameValidation.value,
      email: emailValidation.value,
      password,
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    authLogger.register(emailValidation.value, true);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with validation
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      authLogger.login(email || 'unknown', false, 'Missing email or password');
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_FIELDS',
          message: 'Email and password are required',
        },
      });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      authLogger.login(email, false, emailValidation.message);
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_EMAIL',
          message: emailValidation.message,
        },
      });
    }

    // Find user by email
    const user = await User.findOne({ email: emailValidation.value }).select('+password');

    if (!user) {
      authLogger.login(emailValidation.value, false, 'User not found');
      return res.status(401).json({
        success: false,
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      authLogger.login(emailValidation.value, false, 'Invalid password');
      return res.status(401).json({
        success: false,
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    authLogger.login(emailValidation.value, true);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    authLogger.logout(req.user?.id || 'unknown');

    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};

