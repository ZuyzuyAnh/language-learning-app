const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       required:
 *         - userId
 *         - vocabularyId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         userId:
 *           type: string
 *           description: Reference to user
 *         vocabularyId:
 *           type: string
 *           description: Reference to vocabulary item
 *         status:
 *           type: string
 *           enum: [new, learning, review, mastered]
 *           description: Current learning status
 *         nextReviewDate:
 *           type: string
 *           format: date-time
 *           description: When this card should be reviewed next
 *         reviewHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               performance:
 *                 type: string
 *                 enum: [easy, good, hard, again]
 *         easeFactor:
 *           type: number
 *           description: Spaced repetition algorithm factor
 *         interval:
 *           type: number
 *           description: Days until next review
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vocabularyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vocabulary",
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "learning", "review", "mastered"],
      default: "new",
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    reviewHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        performance: {
          type: String,
          enum: ["easy", "good", "hard", "again"],
          required: true,
        },
      },
    ],
    easeFactor: {
      type: Number,
      default: 2.5, // Spaced repetition algorithm factor
    },
    interval: {
      type: Number,
      default: 1, // Days
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
