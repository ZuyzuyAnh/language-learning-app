const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    vocabulary: {
      learned: {
        type: Number,
        default: 0,
      },
      mastered: {
        type: Number,
        default: 0,
      },
    },
    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        score: Number,
        completedAt: Date,
      },
    ],
    tests: [
      {
        testId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Test",
        },
        score: Number,
        passed: Boolean,
        completedAt: Date,
      },
    ],
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    totalTimeSpent: {
      type: Number, // Minutes
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Progress:
 *       type: object
 *       required:
 *         - userId
 *         - language
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         userId:
 *           type: string
 *           description: Reference to user
 *         language:
 *           type: string
 *           description: Language code
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Current level
 *         vocabulary:
 *           type: object
 *           properties:
 *             learned:
 *               type: number
 *             mastered:
 *               type: number
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               exerciseId:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               score:
 *                 type: number
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *         tests:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               testId:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               passed:
 *                 type: boolean
 *               score:
 *                 type: number
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *         streakDays:
 *           type: number
 *           description: Current streak in days
 *         lastActivity:
 *           type: string
 *           format: date-time
 *         totalTimeSpent:
 *           type: number
 *           description: Total time spent in minutes
 */
