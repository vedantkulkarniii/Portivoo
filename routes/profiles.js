const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route
router.get('/public/:subdomain', getPublicProfile);

// All other routes are protected
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/check-subdomain/:subdomain', checkSubdomain);
router.put('/me/subdomain', updateSubdomain);
router.put('/me/active', toggleActive);
router.post('/upload', upload.single('image'), uploadImage);
router.post('/publish', publishProfile);
router.put('/deactivate', deactivateProfile);
router.post('/deploy', deployProfile);

module.exports = router;

