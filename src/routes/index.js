const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const postRoutes = require("./post.routes");

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(postRoutes);

module.exports = router;
