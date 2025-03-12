const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const auth = require("../middleware/auth");

// Public routes
router.get("/posts", communityController.getPublicPosts);
router.get("/posts/:id", communityController.getPostById);

// Protected routes
router.use(auth);

// Get user's posts
router.get("/user/posts", communityController.getUserPosts);

// Create a post
router.post("/posts", communityController.createPost);

// Update a post
router.put("/posts/:id", communityController.updatePost);

// Delete a post
router.delete("/posts/:id", communityController.deletePost);

// Like/unlike a post
router.put("/posts/:id/like", communityController.toggleLikePost);

// Add comment to a post
router.post("/posts/:id/comments", communityController.addComment);

// Delete comment from a post
router.delete(
  "/posts/:id/comments/:commentId",
  communityController.deleteComment
);

module.exports = router;
