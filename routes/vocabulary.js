const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabularyController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Vocabulary
 *   description: Vocabulary management
 */

/**
 * @swagger
 * /api/vocabulary/public:
 *   get:
 *     summary: Get public vocabulary
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         description: Filter by topic
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of vocabulary items
 *       500:
 *         description: Server error
 */
router.get("/public", vocabularyController.getPublicVocabulary);

/**
 * @swagger
 * /api/vocabulary/topics:
 *   get:
 *     summary: Get all vocabulary topics
 *     tags: [Vocabulary]
 *     responses:
 *       200:
 *         description: List of vocabulary topics
 *       500:
 *         description: Server error
 */
router.get("/topics", vocabularyController.getVocabularyTopics);

/**
 * @swagger
 * /api/vocabulary/public/{id}:
 *   get:
 *     summary: Get public vocabulary by ID
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *     responses:
 *       200:
 *         description: Vocabulary item
 *       404:
 *         description: Vocabulary not found
 *       500:
 *         description: Server error
 */
router.get("/public/:id", vocabularyController.getPublicVocabularyById);

// Protected routes
router.use(auth);

/**
 * @swagger
 * /api/vocabulary/language/{language}:
 *   get:
 *     summary: Get vocabulary by language
 *     tags: [Vocabulary]
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
 *         description: List of vocabulary items
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/language/:language", vocabularyController.getVocabularyByLanguage);

/**
 * @swagger
 * /api/vocabulary/topic/{topic}:
 *   get:
 *     summary: Get vocabulary by topic
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic name
 *     responses:
 *       200:
 *         description: List of vocabulary items
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/topic/:topic", vocabularyController.getVocabularyByTopic);

/**
 * @swagger
 * /api/vocabulary/user:
 *   get:
 *     summary: Get user's vocabulary
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's vocabulary items
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/user", vocabularyController.getUserVocabulary);

/**
 * @swagger
 * /api/vocabulary/add:
 *   post:
 *     summary: Add vocabulary to user's collection
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vocabularyId
 *             properties:
 *               vocabularyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vocabulary added successfully
 *       400:
 *         description: Vocabulary already in collection
 *       404:
 *         description: Vocabulary not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/add", vocabularyController.addVocabularyToUser);

/**
 * @swagger
 * /api/vocabulary:
 *   post:
 *     summary: Create custom vocabulary
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - word
 *               - language
 *             properties:
 *               word:
 *                 type: string
 *               language:
 *                 type: string
 *               translation:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                   language:
 *                     type: string
 *               partOfSpeech:
 *                 type: string
 *               definition:
 *                 type: string
 *               examples:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Vocabulary created successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/", vocabularyController.createVocabulary);

/**
 * @swagger
 * /api/vocabulary/{id}:
 *   put:
 *     summary: Update vocabulary
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *               translation:
 *                 type: object
 *               definition:
 *                 type: string
 *               examples:
 *                 type: array
 *                 items:
 *                   type: string
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Vocabulary updated successfully
 *       404:
 *         description: Vocabulary not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id", vocabularyController.updateVocabulary);

/**
 * @swagger
 * /api/vocabulary/{id}:
 *   delete:
 *     summary: Delete vocabulary
 *     tags: [Vocabulary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vocabulary ID
 *     responses:
 *       200:
 *         description: Vocabulary deleted successfully
 *       404:
 *         description: Vocabulary not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", vocabularyController.deleteVocabulary);

module.exports = router;
