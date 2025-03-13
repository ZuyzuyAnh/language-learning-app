const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerConfig = require("./config/swagger");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const flashcardRoutes = require("./routes/flashcard");
const vocabularyRoutes = require("./routes/vocabulary");
const exerciseRoutes = require("./routes/exercise");
const testRoutes = require("./routes/test");
const progressRoutes = require("./routes/progress");
const communityRoutes = require("./routes/community");

dotenv.config();
const app = express();

// Update CORS configuration for both mobile apps and web clients
app.use(
  cors({
    origin: true, // Allow requests from any origin
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: ["Content-Disposition"], // If you need to expose any headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this before your Swagger route
app.use("/api-docs", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Swagger documentation route
app.use("/api-docs", swaggerConfig.serve, swaggerConfig.setup);

// Handle preflight requests
app.options("*", cors());

// Add this after your existing middleware but before routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply rate limiting to all routes
app.use("/api/", apiLimiter);

// Optional: API key validation for mobile apps
app.use("/api/", (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  // Skip API key check for Swagger documentation
  if (req.originalUrl.startsWith("/api-docs")) {
    return next();
  }

  // For development, you might want to skip this check
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  // In production, validate API key
  if (!apiKey || apiKey !== process.env.MOBILE_API_KEY) {
    return res.status(403).json({ message: "Invalid or missing API key" });
  }

  next();
});

// Add basic security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI to work properly
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/community", communityRoutes);

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Language Learning API</h1>
    <p>Visit our <a href="/api-docs">API Documentation</a> to learn more.</p>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});

module.exports = app;
