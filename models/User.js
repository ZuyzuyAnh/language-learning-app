const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - nativeLanguage
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         username:
 *           type: string
 *           description: User's unique username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's hashed password
 *         nativeLanguage:
 *           type: string
 *           description: User's native language
 *         learningLanguages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *         studyPlan:
 *           type: object
 *           properties:
 *             dailyGoal:
 *               type: number
 *             reminderTime:
 *               type: string
 *             daysOfWeek:
 *               type: array
 *               items:
 *                 type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         username: johndoe
 *         email: john@example.com
 *         nativeLanguage: English
 *         learningLanguages: [{language: "Spanish", level: "beginner"}]
 *         studyPlan: {dailyGoal: 15, daysOfWeek: [1,2,3,4,5]}
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nativeLanguage: {
      type: String,
      required: true,
    },
    learningLanguages: [
      {
        language: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
          default: "beginner",
        },
        startedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    studyPlan: {
      dailyGoal: {
        type: Number,
        default: 15, // minutes
      },
      reminderTime: String,
      daysOfWeek: [Number], // 0-6 for Sunday-Saturday
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
