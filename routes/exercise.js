const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise management
 */

/**
 * @swagger
 * /api/exercises/public:
 *   get:
 *     summary: Get public exercises
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by exercise type
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of exercises
 *       500:
 *         description: Server error
 */
router.get("/public", exerciseController.getPublicExercises);

/**
 * @swagger
 * /api/exercises/public/{id}:
 *   get:
 *     summary: Get public exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise details
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Server error
 */
router.get("/public/:id", exerciseController.getPublicExerciseById);

// Protected routes
router.use(auth);

/**
 * @swagger
 * /api/exercises/type/{type}:
 *   get:
 *     summary: Get exercises by type
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise type
 *     responses:
 *       200:
 *         description: List of exercises
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/type/:type", exerciseController.getExercisesByType);

/**
 * @swagger
 * /api/exercises/difficulty/{level}:
 *   get:
 *     summary: Get exercises by difficulty
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Difficulty level
 *     responses:
 *       200:
 *         description: List of exercises
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/difficulty/:level", exerciseController.getExercisesByDifficulty);

/**
 * @swagger
 * /api/exercises/language/{language}:
 *   get:
 *     summary: Get exercises by language
 *     tags: [Exercises]
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
 *         description: List of exercises
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/language/:language", exerciseController.getExercisesByLanguage);

/**
 * @swagger
 * /api/exercises/user:
 *   get:
 *     summary: Get user's exercises
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's exercises
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/user", exerciseController.getUserExercises);

/**
 * @swagger
 * /api/exercises/{id}/submit:
 *   post:
 *     summary: Submit exercise results
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *               timeSpent:
 *                 type: number
 *                 description: Time spent in seconds
 *     responses:
 *       200:
 *         description: Exercise results
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/:id/submit", exerciseController.submitExerciseResults);

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create exercise (admin only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - language
 *               - difficulty
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [multiple-choice, fill-in-blanks, matching, listening, speaking]
 *               language:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               content:
 *                 type: object
 *               estimatedTime:
 *                 type: number
 *                 description: Estimated time in minutes
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/", exerciseController.createExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Update exercise (admin only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id", exerciseController.updateExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete exercise (admin only)
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *       404:
 *         description: Exercise not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
