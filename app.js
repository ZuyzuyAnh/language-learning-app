const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send("Welcome to Language Learning API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
