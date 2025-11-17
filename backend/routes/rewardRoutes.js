const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import the function from the controller
const { getRewardStatus } = require('../controllers/rewardController');

// @route   GET /api/rewards/status
// @desc    Check if user earned a reward for the current month
router.get('/status', protect, getRewardStatus);

module.exports = router;