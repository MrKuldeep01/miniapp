const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  getProfile,
  getAccount,
  getEditProfile,
  postEditProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(getProfile));
router.get("/account/:id", requireAuth, asyncHandler(getAccount));
router.get("/profile/edit", requireAuth, asyncHandler(getEditProfile));
router.post("/profile/edit", requireAuth, asyncHandler(postEditProfile));

module.exports = router;
