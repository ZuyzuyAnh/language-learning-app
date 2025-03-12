const mongoose = require("mongoose");

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
