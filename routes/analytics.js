const express = require('express');
const router = express.Router();
const { getAnalyticsSummary } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All analytics routes are protected (per-user summary)
router.use(protect);

router.get('/summary', getAnalyticsSummary);

module.exports = router;
