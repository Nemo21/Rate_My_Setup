const express = require("express");
const Post = require("../models/post");
const Rating = require("../models/rating");
const security = require("../middleware/security");
const permissions = require("../middleware/permissions");
const router = express.Router();

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const post = await Post.createNewPost({ user, post: req.body });
    return res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.listPosts();
    return res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
});

router.get("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.fetchPostById(postId);
    return res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:postId",
  security.requireAuthenticatedUser,
  permissions.authedUserOwnsPost,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await Post.editPost({ postUpdate: req.body, postId });
      return res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:postId/ratings",
  security.requireAuthenticatedUser,
  permissions.authedUserIsNotPostOwner,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user } = res.locals;
      const rating = await Rating.createRatingForPost({
        rating: req.body.rating,
        user,
        postId,
      });
      return res.status(201).json({ rating });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
