const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
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
      enum: ["vocabulary", "grammar", "comprehensive"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
    duration: Number, // Time in minutes
    passingScore: {
      type: Number,
      default: 70, // Percentage
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
