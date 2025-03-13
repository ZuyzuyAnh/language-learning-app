const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

/**
 * @swagger
 * /api/flashcards:
 *   get:
 *     summary: Get all flashcards for the current user
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/", flashcardController.getUserFlashcards);

/**
 * @swagger
 * /api/flashcards/due:
 *   get:
 *     summary: Get flashcards due for review
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flashcards due for review
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/due", flashcardController.getDueFlashcards);

/**
 * @swagger
 * /api/flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Flashcards]
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
 *                 description: ID of the vocabulary item
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *       400:
 *         description: Flashcard already exists
 *       404:
 *         description: Vocabulary not found
 *       500:
 *         description: Server error
 */
router.post("/", flashcardController.createFlashcard);

/**
 * @swagger
 * /api/flashcards/{flashcardId}/review:
 *   put:
 *     summary: Update flashcard review status
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flashcardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - performance
 *             properties:
 *               performance:
 *                 type: string
 *                 enum: [again, hard, good, easy]
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Server error
 */
router.put("/:flashcardId/review", flashcardController.updateFlashcardReview);

/**
 * @swagger
 * /api/flashcards/{flashcardId}:
 *   delete:
 *     summary: Delete a flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flashcardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Server error
 */
router.delete("/:flashcardId", flashcardController.deleteFlashcard);

module.exports = router;
