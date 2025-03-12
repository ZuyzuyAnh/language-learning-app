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
