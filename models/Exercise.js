const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    language: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["grammar", "listening", "pronunciation", "reading", "writing"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    content: {
      instructions: String,
      questions: [
        {
          questionText: String,
          questionType: {
            type: String,
            enum: [
              "multiple-choice",
              "fill-in-blank",
              "matching",
              "reorder",
              "speaking",
            ],
            required: true,
          },
          options: [String],
          correctAnswer: mongoose.Schema.Types.Mixed,
          explanation: String,
          points: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    mediaUrl: String,
    duration: Number,
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - language
 *         - difficulty
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Exercise title
 *         description:
 *           type: string
 *           description: Exercise description
 *         type:
 *           type: string
 *           enum: [multiple-choice, fill-in-blanks, matching, listening, speaking]
 *           description: Type of exercise
 *         language:
 *           type: string
 *           description: Language code
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level
 *         content:
 *           type: object
 *           description: Exercise content (varies by type)
 *         estimatedTime:
 *           type: number
 *           description: Estimated time to complete in minutes
 *         createdAt:
 *           type: string
 *           format: date-time
 */

module.exports = mongoose.model("Exercise", exerciseSchema);
