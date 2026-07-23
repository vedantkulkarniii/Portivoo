/**
 * Request/Response logging middleware with detailed information
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

/**
 * Format timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log message to file and console
 * @param {string} level - Log level (INFO, ERROR, WARN, DEBUG)
 * @param {string} message - Log message
 * @param {object} data - Additional data to log
 */
const log = (level, message, data = {}) => {
  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  const fullMessage = Object.keys(data).length > 0 ? `${logMessage} ${JSON.stringify(data)}` : logMessage;

  // Log to file
  try {
    fs.appendFileSync(logFile, `${fullMessage}\n`);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }

  // Log to console based on level
  switch (level) {
    case 'ERROR':
      console.error(fullMessage);
      break;
    case 'WARN':
      console.warn(fullMessage);
      break;
    case 'DEBUG':
      if (process.env.NODE_ENV === 'development') {
        console.debug(fullMessage);
      }
      break;
    default:
      console.log(fullMessage);
  }
};

/**
 * Express middleware for logging HTTP requests and responses
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip, headers } = req;

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    const logData = {
      method,
      url: originalUrl,
      ip: ip || req.connection.remoteAddress,
      statusCode,
      duration: `${duration}ms`,
      userAgent: headers['user-agent'],
    };

    // Log successful responses
    if (statusCode >= 200 && statusCode < 400) {
      log('INFO', `HTTP ${method} ${originalUrl}`, logData);
    }
    // Log client errors
    else if (statusCode >= 400 && statusCode < 500) {
      log('WARN', `HTTP ${method} ${originalUrl} - Client Error`, logData);
    }
    // Log server errors
    else {
      log('ERROR', `HTTP ${method} ${originalUrl} - Server Error`, logData);
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Logger for authentication events
 */
const authLogger = {
  login: (email, success, reason = '') => {
    log('INFO', `Authentication: Login attempt for ${email}`, {
      success,
      reason: reason || 'N/A',
    });
  },

  register: (email, success, reason = '') => {
    log('INFO', `Authentication: Registration for ${email}`, {
      success,
      reason: reason || 'N/A',
    });
  },

  logout: (userId) => {
    log('INFO', `Authentication: User logout`, { userId });
  },

  tokenVerificationFailed: (reason = '') => {
    log('WARN', `Authentication: Token verification failed`, { reason });
  },
};

/**
 * Logger for profile operations
 */
const profileLogger = {
  update: (userId, changes) => {
    log('INFO', `Profile: Update by user ${userId}`, { changes });
  },

  publish: (userId, subdomain) => {
    log('INFO', `Profile: Published by user ${userId}`, { subdomain });
  },

  deactivate: (userId) => {
    log('INFO', `Profile: Deactivated by user ${userId}`, {});
  },

  uploadImage: (userId, filename) => {
    log('INFO', `Profile: Image uploaded by user ${userId}`, { filename });
  },
};

/**
 * Logger for errors
 */
const errorLogger = {
  database: (operation, error) => {
    log('ERROR', `Database error during ${operation}`, {
      error: error.message,
      stack: error.stack,
    });
  },

  validation: (field, value, reason) => {
    log('WARN', `Validation error for field ${field}`, { reason });
  },

  notFound: (resource, id) => {
    log('WARN', `${resource} not found`, { id });
  },

  unauthorized: (userId, resource) => {
    log('WARN', `Unauthorized access attempt`, { userId, resource });
  },

  unexpected: (error) => {
    log('ERROR', `Unexpected error`, {
      error: error.message,
      stack: error.stack,
    });
  },
};

module.exports = {
  log,
  requestLogger,
  authLogger,
  profileLogger,
  errorLogger,
  getTimestamp,
};
