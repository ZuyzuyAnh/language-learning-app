const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/profile", userController.getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               nativeLanguage:
 *                 type: string
 *               learningLanguages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [beginner, intermediate, advanced]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/profile", userController.updateUserProfile);

/**
 * @swagger
 * /api/users/study-plan:
 *   put:
 *     summary: Update study plan
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyGoal:
 *                 type: number
 *               reminderTime:
 *                 type: string
 *               daysOfWeek:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Study plan updated successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/study-plan", userController.updateStudyPlan);

/**
 * @swagger
 * /api/users/statistics:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/statistics", userController.getUserStatistics);

module.exports = router;
