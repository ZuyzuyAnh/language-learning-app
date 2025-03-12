const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: User progress tracking
 */

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get user progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/", progressController.getUserProgress);

/**
 * @swagger
 * /api/progress/language/{language}:
 *   get:
 *     summary: Get progress by language
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *         description: Language code
 *     responses:
 *       200:
 *         description: Progress for specific language
 *       404:
 *         description: Progress not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/language/:language", progressController.getProgressByLanguage);

/**
 * @swagger
 * /api/progress/streak:
 *   get:
 *     summary: Get user streak information
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User streak data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/streak", progressController.getUserStreak);

/**
 * @swagger
 * /api/progress/daily-activity:
 *   post:
 *     summary: Update daily activity
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - timeSpent
 *             properties:
 *               language:
 *                 type: string
 *               timeSpent:
 *                 type: number
 *                 description: Time spent in minutes
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [vocabulary, exercise, test]
 *                     id:
 *                       type: string
 *     responses:
 *       200:
 *         description: Daily activity updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/daily-activity", progressController.updateDailyActivity);

/**
 * @swagger
 * /api/progress/statistics:
 *   get:
 *     summary: Get learning statistics
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning statistics
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/statistics", progressController.getLearningStatistics);

module.exports = router;
