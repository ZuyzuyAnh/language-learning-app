const Flashcard = require("../models/Flashcard");
const Vocabulary = require("../models/Vocabulary");

exports.getUserFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user.id })
      .populate("vocabularyId")
      .sort({ nextReviewDate: 1 });

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDueFlashcards = async (req, res) => {
  try {
    const now = new Date();
    const flashcards = await Flashcard.find({
      userId: req.user.id,
      nextReviewDate: { $lte: now },
    })
      .populate("vocabularyId")
      .sort({ nextReviewDate: 1 })
      .limit(20);

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const { vocabularyId } = req.body;

    const vocabulary = await Vocabulary.findById(vocabularyId);
    if (!vocabulary) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    const existingFlashcard = await Flashcard.findOne({
      userId: req.user.id,
      vocabularyId,
    });

    if (existingFlashcard) {
      return res.status(400).json({ message: "Flashcard already exists" });
    }

    const flashcard = new Flashcard({
      userId: req.user.id,
      vocabularyId,
    });

    await flashcard.save();

    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateFlashcardReview = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { performance } = req.body;

    const flashcard = await Flashcard.findOne({
      _id: flashcardId,
      userId: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    let { easeFactor, interval } = flashcard;

    switch (performance) {
      case "again":
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        break;
      case "hard":
        interval = Math.max(1, Math.ceil(interval * 1.2));
        easeFactor = Math.max(1.3, easeFactor - 0.15);
        break;
      case "good":
        interval = Math.ceil(interval * easeFactor);
        break;
      case "easy":
        interval = Math.ceil(interval * easeFactor * 1.3);
        easeFactor += 0.15;
        break;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    flashcard.reviewHistory.push({ performance });
    flashcard.easeFactor = easeFactor;
    flashcard.interval = interval;
    flashcard.nextReviewDate = nextReviewDate;

    if (interval >= 30) {
      flashcard.status = "mastered";
    } else if (interval >= 7) {
      flashcard.status = "review";
    } else {
      flashcard.status = "learning";
    }

    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;

    const flashcard = await Flashcard.findOneAndDelete({
      _id: flashcardId,
      userId: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
