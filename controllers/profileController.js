const Profile = require('../models/Profile');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const generateSubdomain = require('../utils/generateSubdomain');
const { validateSubdomain, validatePortfolioType, validateFileUpload, isValidObjectId } = require('../middleware/validation');
const { profileLogger, errorLogger } = require('../middleware/logger');
const path = require('path');
const fs = require('fs');

/**
 * Get user's profile
 * @route   GET /api/profiles/me
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: { type: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create default profile if doesn't exist
      profile = await Profile.create({
        userId: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    errorLogger.database('getProfile', error);
    next(error);
  }
};

/**
 * Get public portfolio by subdomain
 * @route   GET /api/profiles/public/:subdomain
 * @access  Public
 */
const getPublicProfile = async (req, res, next) => {
  try {
    const { subdomain } = req.params;

    // Validate subdomain format
    const subdomainValidation = validateSubdomain(subdomain);
    if (!subdomainValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: { type: 'INVALID_SUBDOMAIN', message: subdomainValidation.message },
      });
    }

    const profile = await Profile.findOne({ subdomain: subdomainValidation.value, active: true })
      .populate('userId', 'name email')
      .populate('deployment.templateId');

    if (!profile) {
      errorLogger.notFound('Portfolio', subdomainValidation.value);
      return res.status(404).json({
        success: false,
        error: {
          type: 'NOT_FOUND',
          message: 'Portfolio not found or deactivated',
        },
      });
    }

    // Fire-and-forget analytics event for this public view
    try {
      const ipHeader = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
      const ip = Array.isArray(ipHeader)
        ? ipHeader[0]
        : typeof ipHeader === 'string'
        ? ipHeader.split(',')[0].trim()
        : '';

      const countryHeader =
        req.headers['x-country'] ||
        req.headers['x-country-code'] ||
        req.headers['cf-ipcountry'] ||
        req.headers['x-vercel-ip-country'] ||
        'Unknown';

      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || req.headers['referrer'] || '';

      AnalyticsEvent.create({
        profileId: profile._id,
        subdomain: profile.subdomain,
        ip,
        userAgent,
        referrer,
        country: countryHeader,
      }).catch(() => {});
    } catch (e) {
      // Do not block portfolio loading if analytics fails
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    errorLogger.database('getPublicProfile', error);
    next(error);
  }
};

/**
 * Check subdomain availability
 * @route   GET /api/profiles/check-subdomain/:subdomain
 * @access  Private
 */
const checkSubdomain = async (req, res, next) => {
  try {
    const { subdomain } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: { type: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    // Validate subdomain format
    const validation = validateSubdomain(subdomain);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        available: false,
        error: { type: 'INVALID_SUBDOMAIN', message: validation.message },
      });
    }

    const existing = await Profile.findOne({
      subdomain: validation.value,
      userId: { $ne: req.user._id },
    });

    res.status(200).json({
      success: true,
      available: !existing,
      message: existing ? 'Subdomain already taken' : 'Subdomain available',
    });
  } catch (error) {
    errorLogger.database('checkSubdomain', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/profiles/me
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
        ...req.body,
      });
    } else {
      // Update profile
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined && key !== 'subdomain') {
          profile[key] = req.body[key];
        }
      });
      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subdomain
// @route   PUT /api/profiles/me/subdomain
// @access  Private
const updateSubdomain = async (req, res, next) => {
  try {
    const { subdomain } = req.body;

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain is required',
      });
    }

    // Validate format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subdomain format',
      });
    }

    // Check availability
    const existing = await Profile.findOne({
      subdomain,
      userId: { $ne: req.user._id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain already taken',
      });
    }

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
        subdomain,
      });
    } else {
      profile.subdomain = subdomain;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Subdomain updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle portfolio active status
// @route   PUT /api/profiles/me/active
// @access  Private
const toggleActive = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.active = req.body.active !== undefined ? req.body.active : !profile.active;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
      message: profile.active ? 'Portfolio activated' : 'Portfolio deactivated',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload image file
 * @route   POST /api/profiles/upload
 * @access  Private
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: { type: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'NO_FILE',
          message: 'No file uploaded',
        },
      });
    }

    // Validate file
    const fileValidation = validateFileUpload(req.file);
    if (!fileValidation.isValid) {
      // Clean up uploaded file on validation failure
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_FILE',
          message: fileValidation.message,
        },
      });
    }

    // Log the upload
    profileLogger.uploadImage(req.user._id, req.file.filename);

    // Return the file path (relative to public/uploads)
    const filePath = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        url: filePath,
        filename: req.file.filename,
        size: req.file.size,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    errorLogger.database('uploadImage', error);
    next(error);
  }
};

// @desc    Publish profile with subdomain
// @route   POST /api/profiles/publish
// @access  Private
const publishProfile = async (req, res, next) => {
  try {
    const { subdomain, template } = req.body;

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain is required',
      });
    }

    // Validate format
    if (!/^[a-z0-9-]+$/.test(subdomain) || subdomain.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subdomain format',
      });
    }

    // Check availability
    const existing = await Profile.findOne({
      subdomain,
      userId: { $ne: req.user._id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain already taken',
      });
    }

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Update profile with subdomain and publish
    profile.subdomain = subdomain;
    profile.active = true;
    if (template && ['dark', 'light', 'modern'].includes(template)) {
      profile.template = template;
    }
    profile.deployment = {
      isDeployed: true,
      subdomain: subdomain,
      templateId: profile.deployment?.templateId,
      deployedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Portfolio published successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate profile
// @route   PUT /api/profiles/deactivate
// @access  Private
const deactivateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.active = false;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Portfolio deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deploy profile with template
// @route   POST /api/profiles/deploy
// @access  Private
const deployProfile = async (req, res, next) => {
  try {
    const { templateId, template } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
      });
    }

    // Update template choice if provided
    if (template && ['dark', 'light', 'modern'].includes(template)) {
      profile.template = template;
    }

    // Update deployment info
    profile.deployment = {
      isDeployed: profile.subdomain ? true : false,
      subdomain: profile.subdomain,
      templateId: templateId || profile.deployment?.templateId,
      deployedAt: profile.deployment?.deployedAt || (profile.subdomain ? new Date() : undefined),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getPublicProfile,
  checkSubdomain,
  updateProfile,
  updateSubdomain,
  toggleActive,
  uploadImage,
  publishProfile,
  deactivateProfile,
  deployProfile,
};
