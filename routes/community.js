const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: Community and social features
 */

/**
 * @swagger
 * /api/community/posts:
 *   get:
 *     summary: Get public posts
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of posts
 *       500:
 *         description: Server error
 */
router.get("/posts", communityController.getPublicPosts);

/**
 * @swagger
 * /api/community/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/posts/:id", communityController.getPostById);

// Protected routes
router.use(auth);

/**
 * @swagger
 * /api/community/user/posts:
 *   get:
 *     summary: Get user's posts
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's posts
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/user/posts", communityController.getUserPosts);

/**
 * @swagger
 * /api/community/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - language
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               language:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/posts", communityController.createPost);

/**
 * @swagger
 * /api/community/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/posts/:id", communityController.updatePost);

/**
 * @swagger
 * /api/community/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete("/posts/:id", communityController.deletePost);

/**
 * @swagger
 * /api/community/posts/{id}/like:
 *   put:
 *     summary: Like/unlike a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post like toggled successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put("/posts/:id/like", communityController.toggleLikePost);

/**
 * @swagger
 * /api/community/posts/{id}/comments:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/posts/:id/comments", communityController.addComment);

/**
 * @swagger
 * /api/community/posts/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete comment from a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Post or comment not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete(
  "/posts/:id/comments/:commentId",
  communityController.deleteComment
);

module.exports = router;
