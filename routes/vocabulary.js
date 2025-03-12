const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabularyController");
const auth = require("../middleware/auth");

// Public routes
router.get("/public", vocabularyController.getPublicVocabulary);
router.get("/topics", vocabularyController.getVocabularyTopics);
router.get("/public/:id", vocabularyController.getPublicVocabularyById);

// Protected routes
router.use(auth);

// Get vocabulary by language and topic
router.get("/language/:language", vocabularyController.getVocabularyByLanguage);
router.get("/topic/:topic", vocabularyController.getVocabularyByTopic);

// Get user's vocabulary
router.get("/user", vocabularyController.getUserVocabulary);

// Add vocabulary to user's collection
router.post("/add", vocabularyController.addVocabularyToUser);

// Create custom vocabulary
router.post("/", vocabularyController.createVocabulary);

// Update vocabulary
router.put("/:id", vocabularyController.updateVocabulary);

// Delete vocabulary
router.delete("/:id", vocabularyController.deleteVocabulary);

module.exports = router;
