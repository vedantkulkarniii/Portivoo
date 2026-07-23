/**
 * Centralized validation utilities for input sanitization and validation
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 6;
const nameMinLength = 2;
const nameMaxLength = 50;
const subdomainRegex = /^[a-z0-9-]+$/;

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} Validation result with isValid and message
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required and must be a string' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  if (trimmedEmail.length > 100) {
    return { isValid: false, message: 'Email is too long (max 100 characters)' };
  }

  return { isValid: true, value: trimmedEmail };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required and must be a string' };
  }

  if (password.length < passwordMinLength) {
    return {
      isValid: false,
      message: `Password must be at least ${passwordMinLength} characters long`,
    };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (max 128 characters)' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

/**
 * Validates user name
 * @param {string} name - Name to validate
 * @returns {object} Validation result with isValid and message
 */
const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Name is required and must be a string' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < nameMinLength) {
    return {
      isValid: false,
      message: `Name must be at least ${nameMinLength} characters long`,
    };
  }

  if (trimmedName.length > nameMaxLength) {
    return {
      isValid: false,
      message: `Name must not exceed ${nameMaxLength} characters`,
    };
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z0-9\s\-']+$/.test(trimmedName)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true, value: trimmedName };
};

/**
 * Validates subdomain format and length
 * @param {string} subdomain - Subdomain to validate
 * @returns {object} Validation result with isValid and message
 */
const validateSubdomain = (subdomain) => {
  if (!subdomain || typeof subdomain !== 'string') {
    return { isValid: false, message: 'Subdomain is required and must be a string' };
  }

  const trimmedSubdomain = subdomain.trim().toLowerCase();

  if (trimmedSubdomain.length < 3) {
    return {
      isValid: false,
      message: 'Subdomain must be at least 3 characters long',
    };
  }

  if (trimmedSubdomain.length > 63) {
    return {
      isValid: false,
      message: 'Subdomain must not exceed 63 characters',
    };
  }

  if (!subdomainRegex.test(trimmedSubdomain)) {
    return {
      isValid: false,
      message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
    };
  }

  // Check that it doesn't start or end with a hyphen
  if (trimmedSubdomain.startsWith('-') || trimmedSubdomain.endsWith('-')) {
    return {
      isValid: false,
      message: 'Subdomain cannot start or end with a hyphen',
    };
  }

  return { isValid: true, value: trimmedSubdomain };
};

/**
 * Validates portfolio type
 * @param {string} portfolioType - Portfolio type to validate
 * @returns {object} Validation result with isValid and message
 */
const validatePortfolioType = (portfolioType) => {
  const validTypes = [
    'Developer',
    'Photographer',
    'UIUXDesigner',
    'GraphicDesigner',
    'ContentWriter',
    'DigitalMarketer',
    'Architect',
    'MusicianArtist',
    'TeacherEducator',
    'Custom',
  ];

  if (!portfolioType || typeof portfolioType !== 'string') {
    return { isValid: false, message: 'Portfolio type is required and must be a string' };
  }

  if (!validTypes.includes(portfolioType)) {
    return {
      isValid: false,
      message: `Invalid portfolio type. Valid types: ${validTypes.join(', ')}`,
    };
  }

  return { isValid: true, value: portfolioType };
};

/**
 * Sanitizes string input by trimming and escaping special characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000); // Limit length to prevent abuse
};

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} Whether ID is valid MongoDB ObjectId format
 */
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates file upload (size and type)
 * @param {object} file - File object from multer
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateFileUpload = (
  file,
  options = { maxSize: 5242880, allowedMimes: ['image/jpeg', 'image/png', 'image/gif'] },
) => {
  if (!file) {
    return { isValid: false, message: 'No file uploaded' };
  }

  if (file.size > options.maxSize) {
    return {
      isValid: false,
      message: `File size exceeds limit of ${options.maxSize / (1024 * 1024)}MB`,
    };
  }

  if (!options.allowedMimes.includes(file.mimetype)) {
    return {
      isValid: false,
      message: `File type not allowed. Allowed types: ${options.allowedMimes.join(', ')}`,
    };
  }

  return { isValid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateSubdomain,
  validatePortfolioType,
  sanitizeString,
  isValidObjectId,
  validateFileUpload,
};
