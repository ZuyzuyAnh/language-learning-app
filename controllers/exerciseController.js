const Exercise = require("../models/Exercise");
const Progress = require("../models/Progress");

// Get public exercises
exports.getPublicExercises = async (req, res) => {
  try {
    const { language, type, difficulty, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    if (language) query.language = language;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exercises = await Exercise.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exercise.countDocuments(query);

    res.json({
      exercises,
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

// Get public exercise by ID
exports.getPublicExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get exercises by type
exports.getExercisesByType = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exercises = await Exercise.find({ type: req.params.type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exercise.countDocuments({ type: req.params.type });

    res.json({
      exercises,
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

// Get exercises by difficulty
exports.getExercisesByDifficulty = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exercises = await Exercise.find({ difficulty: req.params.level })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exercise.countDocuments({
      difficulty: req.params.level,
    });

    res.json({
      exercises,
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

// Get exercises by language
exports.getExercisesByLanguage = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exercises = await Exercise.find({ language: req.params.language })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Exercise.countDocuments({
      language: req.params.language,
    });

    res.json({
      exercises,
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

// Get user's exercises
exports.getUserExercises = async (req, res) => {
  try {
    // Get user progress
    const progress = await Progress.find({ userId: req.user.id });

    // Get all exercise IDs from progress
    const exerciseIds = progress.flatMap((p) =>
      p.exercises.map((e) => e.exerciseId)
    );

    // Get exercises
    const exercises = await Exercise.find({ _id: { $in: exerciseIds } });

    // Combine with progress data
    const exercisesWithProgress = exercises.map((exercise) => {
      const progressData = progress
        .flatMap((p) => p.exercises)
        .find((e) => e.exerciseId.toString() === exercise._id.toString());

      return {
        ...exercise.toObject(),
        completed: progressData?.completed || false,
        score: progressData?.score,
        completedAt: progressData?.completedAt,
      };
    });

    res.json(exercisesWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit exercise results
exports.submitExerciseResults = async (req, res) => {
  try {
    const { score, timeSpent } = req.body;

    // Find exercise
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Update progress
    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user.id,
        language: exercise.language,
        "exercises.exerciseId": { $ne: exercise._id }, // Don't duplicate exercises
      },
      {
        $push: {
          exercises: {
            exerciseId: exercise._id,
            completed: true,
            score,
            completedAt: new Date(),
          },
        },
        $inc: { totalTimeSpent: timeSpent || 0 },
        $set: { lastActivity: new Date() },
      },
      { upsert: true, new: true }
    );

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

    res.json({ message: "Exercise results submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create exercise (admin only)
exports.createExercise = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      type,
      difficulty,
      content,
      mediaUrl,
      duration,
      tags,
    } = req.body;

    // Create new exercise
    const exercise = new Exercise({
      title,
      description,
      language,
      type,
      difficulty,
      content,
      mediaUrl,
      duration,
      tags,
    });

    await exercise.save();

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update exercise (admin only)
exports.updateExercise = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      type,
      difficulty,
      content,
      mediaUrl,
      duration,
      tags,
    } = req.body;

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (language) updateFields.language = language;
    if (type) updateFields.type = type;
    if (difficulty) updateFields.difficulty = difficulty;
    if (content) updateFields.content = content;
    if (mediaUrl) updateFields.mediaUrl = mediaUrl;
    if (duration) updateFields.duration = duration;
    if (tags) updateFields.tags = tags;

    // Update exercise
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete exercise (admin only)
exports.deleteExercise = async (req, res) => {
  try {
    // Find and delete exercise
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Update progress records
    await Progress.updateMany(
      { "exercises.exerciseId": req.params.id },
      { $pull: { exercises: { exerciseId: req.params.id } } }
    );

    res.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
