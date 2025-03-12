const Progress = require("../models/Progress");
const User = require("../models/User");

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get progress by language
exports.getProgressByLanguage = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
      language: req.params.language,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user streak
exports.getUserStreak = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });

    // Get max streak
    const maxStreak = Math.max(...progress.map((p) => p.streakDays), 0);

    // Check if user has activity today
    const today = new Date().toISOString().split("T")[0];
    const hasActivityToday = progress.some((p) => {
      const lastActivityDate = new Date(p.lastActivity)
        .toISOString()
        .split("T")[0];
      return lastActivityDate === today;
    });

    res.json({
      currentStreak: maxStreak,
      hasActivityToday,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update daily activity
exports.updateDailyActivity = async (req, res) => {
  try {
    const { language, timeSpent } = req.body;

    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }

    // Check if user is learning this language
    const user = await User.findById(req.user.id);
    const isLearningLanguage = user.learningLanguages.some(
      (l) => l.language === language
    );

    if (!isLearningLanguage) {
      return res
        .status(400)
        .json({ message: "User is not learning this language" });
    }

    // Update progress
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id, language },
      {
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

    res.json({ message: "Daily activity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get learning statistics
exports.getLearningStatistics = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });

    // Calculate statistics
    const statistics = {
      byLanguage: {},
      overall: {
        totalVocabularyLearned: 0,
        totalVocabularyMastered: 0,
        totalExercisesCompleted: 0,
        totalTestsPassed: 0,
        totalTimeSpent: 0,
      },
    };

    // Process each language's progress
    for (const p of progress) {
      // Add language stats
      statistics.byLanguage[p.language] = {
        vocabularyLearned: p.vocabulary.learned,
        vocabularyMastered: p.vocabulary.mastered,
        exercisesCompleted: p.exercises.filter((e) => e.completed).length,
        testsPassed: p.tests.filter((t) => t.passed).length,
        streakDays: p.streakDays,
        timeSpent: p.totalTimeSpent,
      };

      // Update overall stats
      statistics.overall.totalVocabularyLearned += p.vocabulary.learned;
      statistics.overall.totalVocabularyMastered += p.vocabulary.mastered;
      statistics.overall.totalExercisesCompleted += p.exercises.filter(
        (e) => e.completed
      ).length;
      statistics.overall.totalTestsPassed += p.tests.filter(
        (t) => t.passed
      ).length;
      statistics.overall.totalTimeSpent += p.totalTimeSpent;
    }

    // Calculate current streak
    statistics.overall.currentStreak = Math.max(
      ...progress.map((p) => p.streakDays),
      0
    );

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
