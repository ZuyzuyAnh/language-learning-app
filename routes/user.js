const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// Get user profile
router.get("/profile", userController.getUserProfile);

// Update user profile
router.put("/profile", userController.updateUserProfile);

// Update study plan
router.put("/study-plan", userController.updateStudyPlan);

// Get user statistics
router.get("/statistics", userController.getUserStatistics);

module.exports = router;
