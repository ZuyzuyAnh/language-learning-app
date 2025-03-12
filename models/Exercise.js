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
    mediaUrl: String, // For listening exercises
    duration: Number, // Estimated time in minutes
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
