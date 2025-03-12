const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    translation: {
      text: String,
      language: String,
    },
    partOfSpeech: String,
    definition: String,
    examples: [String],
    pronunciation: {
      audio: String,
      phonetic: String,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    topics: [String],
    imageUrl: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vocabulary", vocabularySchema);
