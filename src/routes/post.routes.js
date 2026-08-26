const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  getCreatePost,
  postCreatePost,
  listPosts,
  emptyPosts,
  likePost,
  deletePost,
  getEditPost,
  postEditPost,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/post/create", requireAuth, getCreatePost);
router.post("/post/create", requireAuth, asyncHandler(postCreatePost));
router.get("/posts", requireAuth, asyncHandler(listPosts));
router.get("/post/nothing", requireAuth, emptyPosts);
router.get("/post/like/:postId", requireAuth, asyncHandler(likePost));
router.get("/post/delete/:postId", requireAuth, asyncHandler(deletePost));
router.get("/post/edit/:postId", requireAuth, asyncHandler(getEditPost));
router.post("/post/edit/:postId", requireAuth, asyncHandler(postEditPost));

module.exports = router;
