const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// Get all flashcards for a user
router.get("/", flashcardController.getUserFlashcards);

// Get flashcards due for review
router.get("/due", flashcardController.getDueFlashcards);

// Create a new flashcard
router.post("/", flashcardController.createFlashcard);

// Update flashcard review status
router.put("/:flashcardId/review", flashcardController.updateFlashcardReview);

// Delete a flashcard
router.delete("/:flashcardId", flashcardController.deleteFlashcard);

module.exports = router;
