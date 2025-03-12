const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const auth = require("../middleware/auth");

// Public routes
router.get("/public", exerciseController.getPublicExercises);
router.get("/public/:id", exerciseController.getPublicExerciseById);

// Protected routes
router.use(auth);

// Get exercises by type and difficulty
router.get("/type/:type", exerciseController.getExercisesByType);
router.get("/difficulty/:level", exerciseController.getExercisesByDifficulty);
router.get("/language/:language", exerciseController.getExercisesByLanguage);

// Get user's exercises
router.get("/user", exerciseController.getUserExercises);

// Submit exercise results
router.post("/:id/submit", exerciseController.submitExerciseResults);

// Create exercise (admin only)
router.post("/", exerciseController.createExercise);

// Update exercise (admin only)
router.put("/:id", exerciseController.updateExercise);

// Delete exercise (admin only)
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
