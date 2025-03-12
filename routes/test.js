const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Test management
 */

/**
 * @swagger
 * /api/tests/public:
 *   get:
 *     summary: Get public tests
 *     tags: [Tests]
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
 *         description: Filter by test type
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
 *         description: List of tests
 *       500:
 *         description: Server error
 */
router.get("/public", testController.getPublicTests);

/**
 * @swagger
 * /api/tests/public/{id}:
 *   get:
 *     summary: Get public test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test details
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */
router.get("/public/:id", testController.getPublicTestById);

// Protected routes
router.use(auth);

/**
 * @swagger
 * /api/tests/type/{type}:
 *   get:
 *     summary: Get tests by type
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Test type
 *     responses:
 *       200:
 *         description: List of tests
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/type/:type", testController.getTestsByType);

/**
 * @swagger
 * /api/tests/difficulty/{level}:
 *   get:
 *     summary: Get tests by difficulty
 *     tags: [Tests]
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
 *         description: List of tests
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/difficulty/:level", testController.getTestsByDifficulty);

/**
 * @swagger
 * /api/tests/language/{language}:
 *   get:
 *     summary: Get tests by language
 *     tags: [Tests]
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
 *         description: List of tests
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/language/:language", testController.getTestsByLanguage);

/**
 * @swagger
 * /api/tests/user:
 *   get:
 *     summary: Get user's tests
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tests
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/user", testController.getUserTests);

/**
 * @swagger
 * /api/tests/{id}/start:
 *   get:
 *     summary: Start a test
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test started successfully
 *       404:
 *         description: Test not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/:id/start", testController.startTest);

/**
 * @swagger
 * /api/tests/{id}/submit:
 *   post:
 *     summary: Submit test results
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test ID
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
 *         description: Test results
 *       404:
 *         description: Test not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/:id/submit", testController.submitTestResults);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create test (admin only)
 *     tags: [Tests]
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
 *               - exercises
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               language:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *               passingScore:
 *                 type: number
 *               estimatedTime:
 *                 type: number
 *                 description: Estimated time in minutes
 *     responses:
 *       201:
 *         description: Test created successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/", testController.createTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update test (admin only)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test ID
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
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: string
 *               passingScore:
 *                 type: number
 *     responses:
 *       200:
 *         description: Test updated successfully
 *       404:
 *         description: Test not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id", testController.updateTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete test (admin only)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test deleted successfully
 *       404:
 *         description: Test not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", testController.deleteTest);

module.exports = router;
