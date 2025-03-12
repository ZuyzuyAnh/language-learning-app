const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// Get user progress
router.get("/", progressController.getUserProgress);

// Get progress by language
router.get("/language/:language", progressController.getProgressByLanguage);

// Get streak information
router.get("/streak", progressController.getUserStreak);

// Update daily activity
router.post("/daily-activity", progressController.updateDailyActivity);

// Get learning statistics
router.get("/statistics", progressController.getLearningStatistics);

module.exports = router;
