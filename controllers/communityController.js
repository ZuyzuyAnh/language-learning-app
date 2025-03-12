const Post = require("../models/Post");
const User = require("../models/User");

// Get public posts
exports.getPublicPosts = async (req, res) => {
  try {
    const { language, tag, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    if (language) query.language = language;
    if (tag) query.tags = tag;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
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

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username")
      .populate("comments.userId", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, content, language, tags } = req.body;

    const post = new Post({
      userId: req.user.id,
      title,
      content,
      language,
      tags,
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, language, tags } = req.body;

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (language) updateFields.language = language;
    if (tags) updateFields.tags = tags;

    // Find and update post
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateFields },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Like/unlike a post
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId: req.user.id,
      content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate user info for the new comment
    const populatedPost = await Post.findById(post._id).populate(
      "comments.userId",
      "username"
    );

    const newComment =
      populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete comment from a post
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find comment
    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is authorized to delete the comment
    if (
      comment.userId.toString() !== req.user.id.toString() &&
      post.userId.toString() !== req.user.id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Remove comment
    comment.remove();
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
