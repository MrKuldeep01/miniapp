const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/register", getRegister);
router.post("/register", asyncHandler(postRegister));
router.get("/login", getLogin);
router.post("/login", asyncHandler(postLogin));
router.get("/logout", logout);

module.exports = router;
