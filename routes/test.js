const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const auth = require("../middleware/auth");

// Public routes
router.get("/public", testController.getPublicTests);
router.get("/public/:id", testController.getPublicTestById);

// Protected routes
router.use(auth);

// Get tests by type and difficulty
router.get("/type/:type", testController.getTestsByType);
router.get("/difficulty/:level", testController.getTestsByDifficulty);
router.get("/language/:language", testController.getTestsByLanguage);

// Get user's tests
router.get("/user", testController.getUserTests);

// Start a test
router.get("/:id/start", testController.startTest);

// Submit test results
router.post("/:id/submit", testController.submitTestResults);

// Create test (admin only)
router.post("/", testController.createTest);

// Update test (admin only)
router.put("/:id", testController.updateTest);

// Delete test (admin only)
router.delete("/:id", testController.deleteTest);

module.exports = router;
