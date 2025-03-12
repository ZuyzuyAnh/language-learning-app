const Test = require("../models/Test");
const Exercise = require("../models/Exercise");
const Progress = require("../models/Progress");

// Get public tests
exports.getPublicTests = async (req, res) => {
  try {
    const { language, type, difficulty, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    if (language) query.language = language;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments(query);

    res.json({
      tests,
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

// Get public test by ID
exports.getPublicTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get tests by type
exports.getTestsByType = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find({ type: req.params.type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments({ type: req.params.type });

    res.json({
      tests,
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

// Get tests by difficulty
exports.getTestsByDifficulty = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find({ difficulty: req.params.level })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments({
      difficulty: req.params.level,
    });

    res.json({
      tests,
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

// Get tests by language
exports.getTestsByLanguage = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find({ language: req.params.language })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Test.countDocuments({
      language: req.params.language,
    });

    res.json({
      tests,
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

// Get user's tests
exports.getUserTests = async (req, res) => {
  try {
    // Get user progress
    const progress = await Progress.find({ userId: req.user.id });

    // Get all test IDs from progress
    const testIds = progress.flatMap((p) => p.tests.map((t) => t.testId));

    // Get tests
    const tests = await Test.find({ _id: { $in: testIds } });

    // Combine with progress data
    const testsWithProgress = tests.map((test) => {
      const progressData = progress
        .flatMap((p) => p.tests)
        .find((t) => t.testId.toString() === test._id.toString());

      return {
        ...test.toObject(),
        score: progressData?.score,
        passed: progressData?.passed,
        completedAt: progressData?.completedAt,
      };
    });

    res.json(testsWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Start a test
exports.startTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("exercises");

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Prepare test data for client
    // Remove correct answers from exercises
    const testData = {
      ...test.toObject(),
      exercises: test.exercises.map((exercise) => {
        const exerciseData = { ...exercise.toObject() };

        // Remove correct answers from questions
        if (exerciseData.content && exerciseData.content.questions) {
          exerciseData.content.questions = exerciseData.content.questions.map(
            (q) => {
              const { correctAnswer, ...questionWithoutAnswer } = q;
              return questionWithoutAnswer;
            }
          );
        }

        return exerciseData;
      }),
    };

    res.json(testData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit test results
exports.submitTestResults = async (req, res) => {
  try {
    const { score, timeSpent, exerciseResults } = req.body;

    // Find test
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Calculate if passed
    const passed = score >= test.passingScore;

    // Update progress
    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user.id,
        language: test.language,
        "tests.testId": { $ne: test._id }, // Don't duplicate tests
      },
      {
        $push: {
          tests: {
            testId: test._id,
            score,
            passed,
            completedAt: new Date(),
          },
        },
        $inc: { totalTimeSpent: timeSpent || 0 },
        $set: { lastActivity: new Date() },
      },
      { upsert: true, new: true }
    );

    // Update exercise progress if exercise results provided
    if (exerciseResults && Array.isArray(exerciseResults)) {
      for (const result of exerciseResults) {
        const { exerciseId, score } = result;

        // Check if exercise exists in progress
        const exerciseExists = progress.exercises.some(
          (e) => e.exerciseId.toString() === exerciseId
        );

        if (!exerciseExists) {
          // Add exercise to progress
          await Progress.findByIdAndUpdate(progress._id, {
            $push: {
              exercises: {
                exerciseId,
                completed: true,
                score,
                completedAt: new Date(),
              },
            },
          });
        }
      }
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastActivityDate = new Date(progress.lastActivity)
      .toISOString()
      .split("T")[0];

    if (today !== lastActivityDate) {
      // Check if last activity was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split("T")[0];

      if (lastActivityDate === yesterdayDate) {
        // Increment streak
        await Progress.findByIdAndUpdate(progress._id, {
          $inc: { streakDays: 1 },
        });
      } else {
        // Reset streak
        await Progress.findByIdAndUpdate(progress._id, {
          $set: { streakDays: 1 },
        });
      }
    }

    res.json({
      message: "Test results submitted successfully",
      passed,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create test (admin only)
exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      type,
      difficulty,
      exercises,
      duration,
      passingScore,
    } = req.body;

    // Validate exercises
    if (exercises && exercises.length > 0) {
      const exerciseCount = await Exercise.countDocuments({
        _id: { $in: exercises },
      });

      if (exerciseCount !== exercises.length) {
        return res.status(400).json({ message: "Some exercises do not exist" });
      }
    }

    // Create new test
    const test = new Test({
      title,
      description,
      language,
      type,
      difficulty,
      exercises,
      duration,
      passingScore,
    });

    await test.save();

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update test (admin only)
exports.updateTest = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      type,
      difficulty,
      exercises,
      duration,
      passingScore,
    } = req.body;

    // Validate exercises if provided
    if (exercises && exercises.length > 0) {
      const exerciseCount = await Exercise.countDocuments({
        _id: { $in: exercises },
      });

      if (exerciseCount !== exercises.length) {
        return res.status(400).json({ message: "Some exercises do not exist" });
      }
    }

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (language) updateFields.language = language;
    if (type) updateFields.type = type;
    if (difficulty) updateFields.difficulty = difficulty;
    if (exercises) updateFields.exercises = exercises;
    if (duration) updateFields.duration = duration;
    if (passingScore) updateFields.passingScore = passingScore;

    // Update test
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete test (admin only)
exports.deleteTest = async (req, res) => {
  try {
    // Find and delete test
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update progress records
    await Progress.updateMany(
      { "tests.testId": req.params.id },
      { $pull: { tests: { testId: req.params.id } } }
    );

    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
