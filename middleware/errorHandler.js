const { errorLogger } = require('./logger');

/**
 * Enhanced error handling middleware with comprehensive error management
 * Catches all errors from controllers and sends proper error responses
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let statusCode = err.statusCode || 500;
  let errorType = 'INTERNAL_SERVER_ERROR';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    error.message = 'Invalid resource ID format';
    errorType = 'INVALID_ID';
    errorLogger.validation('id', err.value, 'Invalid MongoDB ObjectId format');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0] || 'field';
    error.message = `${field} already exists. Please use a different value.`;
    errorType = 'DUPLICATE_FIELD';
    errorLogger.validation(field, err.keyValue[field], 'Duplicate field value');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.message = messages;
    errorType = 'VALIDATION_ERROR';
    errorLogger.validation('multiple', null, messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = 'Invalid token';
    errorType = 'INVALID_TOKEN';
    errorLogger.unauthorized(req.user?.id || 'unknown', 'Invalid JWT');
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = 'Token has expired. Please login again.';
    errorType = 'TOKEN_EXPIRED';
    errorLogger.unauthorized(req.user?.id || 'unknown', 'Expired JWT');
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    error.message = 'File size too large. Maximum size is 5MB.';
    errorType = 'FILE_TOO_LARGE';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    error.message = 'Unexpected file field';
    errorType = 'INVALID_FILE_FIELD';
  }

  // Custom application errors
  if (err.statusCode === 400 || err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 404) {
    statusCode = err.statusCode;
    errorType = 'APPLICATION_ERROR';
  }

  // Log the error with appropriate level
  if (statusCode >= 500) {
    errorLogger.unexpected(err);
  } else if (statusCode >= 400) {
    errorLogger.database('request', err);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      type: errorType,
      message: error.message || 'An error occurred',
      timestamp: new Date().toISOString(),
    },
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  });
};

module.exports = errorHandler;

