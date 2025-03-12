const Vocabulary = require("../models/Vocabulary");
const Flashcard = require("../models/Flashcard");
const Progress = require("../models/Progress");

// Get public vocabulary
exports.getPublicVocabulary = async (req, res) => {
  try {
    const { language, difficulty, topic, limit = 20, page = 1 } = req.query;

    // Build query
    const query = {};
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = topic;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vocabulary = await Vocabulary.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vocabulary.countDocuments(query);

    res.json({
      vocabulary,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vocabulary topics
exports.getVocabularyTopics = async (req, res) => {
  try {
    const topics = await Vocabulary.distinct("topics");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get public vocabulary by ID
exports.getPublicVocabularyById = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vocabulary by language
exports.getVocabularyByLanguage = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vocabulary = await Vocabulary.find({ language: req.params.language })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vocabulary.countDocuments({
      language: req.params.language,
    });

    res.json({
      vocabulary,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get vocabulary by topic
exports.getVocabularyByTopic = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vocabulary = await Vocabulary.find({ topics: req.params.topic })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vocabulary.countDocuments({ topics: req.params.topic });

    res.json({
      vocabulary,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's vocabulary
exports.getUserVocabulary = async (req, res) => {
  try {
    // Get all flashcards for the user
    const flashcards = await Flashcard.find({ userId: req.user.id }).populate(
      "vocabularyId"
    );

    // Extract vocabulary items
    const vocabulary = flashcards.map((flashcard) => ({
      ...flashcard.vocabularyId.toObject(),
      status: flashcard.status,
      nextReviewDate: flashcard.nextReviewDate,
    }));

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add vocabulary to user's collection
exports.addVocabularyToUser = async (req, res) => {
  try {
    const { vocabularyId } = req.body;

    // Check if vocabulary exists
    const vocabulary = await Vocabulary.findById(vocabularyId);
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    // Check if flashcard already exists
    const existingFlashcard = await Flashcard.findOne({
      userId: req.user.id,
      vocabularyId,
    });

    if (existingFlashcard) {
      return res.status(400).json({ message: "Vocabulary already added" });
    }

    // Create new flashcard
    const flashcard = new Flashcard({
      userId: req.user.id,
      vocabularyId,
    });

    await flashcard.save();

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, language: vocabulary.language },
      { $inc: { "vocabulary.learned": 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create custom vocabulary
exports.createVocabulary = async (req, res) => {
  try {
    const {
      word,
      language,
      translation,
      partOfSpeech,
      definition,
      examples,
      pronunciation,
      difficulty,
      topics,
      imageUrl,
    } = req.body;

    // Create new vocabulary
    const vocabulary = new Vocabulary({
      word,
      language,
      translation,
      partOfSpeech,
      definition,
      examples,
      pronunciation,
      difficulty,
      topics,
      imageUrl,
    });

    await vocabulary.save();

    // Create flashcard for the user
    const flashcard = new Flashcard({
      userId: req.user.id,
      vocabularyId: vocabulary._id,
    });

    await flashcard.save();

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, language },
      { $inc: { "vocabulary.learned": 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      vocabulary,
      flashcard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update vocabulary
exports.updateVocabulary = async (req, res) => {
  try {
    const {
      word,
      language,
      translation,
      partOfSpeech,
      definition,
      examples,
      pronunciation,
      difficulty,
      topics,
      imageUrl,
    } = req.body;

    // Build update object
    const updateFields = {};
    if (word) updateFields.word = word;
    if (language) updateFields.language = language;
    if (translation) updateFields.translation = translation;
    if (partOfSpeech) updateFields.partOfSpeech = partOfSpeech;
    if (definition) updateFields.definition = definition;
    if (examples) updateFields.examples = examples;
    if (pronunciation) updateFields.pronunciation = pronunciation;
    if (difficulty) updateFields.difficulty = difficulty;
    if (topics) updateFields.topics = topics;
    if (imageUrl) updateFields.imageUrl = imageUrl;

    // Update vocabulary
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete vocabulary
exports.deleteVocabulary = async (req, res) => {
  try {
    // Find vocabulary
    const vocabulary = await Vocabulary.findById(req.params.id);

    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    // Delete flashcards associated with this vocabulary
    await Flashcard.deleteMany({ vocabularyId: req.params.id });

    // Delete vocabulary
    await Vocabulary.findByIdAndDelete(req.params.id);

    res.json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
