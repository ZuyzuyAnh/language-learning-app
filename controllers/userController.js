const User = require("../models/User");
const Progress = require("../models/Progress");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, nativeLanguage, learningLanguages } = req.body;

    // Build update object
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (nativeLanguage) updateFields.nativeLanguage = nativeLanguage;
    if (learningLanguages) updateFields.learningLanguages = learningLanguages;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update study plan
exports.updateStudyPlan = async (req, res) => {
  try {
    const { dailyGoal, reminderTime, daysOfWeek } = req.body;

    // Build study plan object
    const studyPlan = {};
    if (dailyGoal) studyPlan["studyPlan.dailyGoal"] = dailyGoal;
    if (reminderTime) studyPlan["studyPlan.reminderTime"] = reminderTime;
    if (daysOfWeek) studyPlan["studyPlan.daysOfWeek"] = daysOfWeek;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: studyPlan },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user statistics
exports.getUserStatistics = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });

    // Calculate statistics
    const statistics = {
      totalLanguages: req.user.learningLanguages.length,
      totalVocabularyLearned: progress.reduce(
        (total, p) => total + p.vocabulary.learned,
        0
      ),
      totalVocabularyMastered: progress.reduce(
        (total, p) => total + p.vocabulary.mastered,
        0
      ),
      totalExercisesCompleted: progress.reduce(
        (total, p) => total + p.exercises.filter((e) => e.completed).length,
        0
      ),
      totalTestsPassed: progress.reduce(
        (total, p) => total + p.tests.filter((t) => t.passed).length,
        0
      ),
      currentStreak: Math.max(...progress.map((p) => p.streakDays)),
      totalTimeSpent: progress.reduce(
        (total, p) => total + p.totalTimeSpent,
        0
      ),
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
