const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { signToken } = require("../utils/token");
const { setFlash } = require("../utils/flash");
const { COOKIE_NAME } = require("../constants");

const SALT_ROUNDS = 10;

function getRegister(req, res) {
  res.render("register");
}

async function postRegister(req, res) {
  const { name, username, email, password, age, phone, img } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    setFlash(res, "error", "An account with this email already exists — try logging in instead.");
    return res.redirect("/register");
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await userModel.create({
    name,
    username,
    email,
    password: hash,
    age,
    phone,
    img,
  });

  const token = signToken({ email, userid: newUser._id });
  res.cookie(COOKIE_NAME, token);
  setFlash(res, "success", `Welcome to miniapp, ${name}!`);
  res.redirect("/");
}

function getLogin(req, res) {
  res.render("login");
}

async function postLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    setFlash(res, "error", "Email and password are required.");
    return res.redirect("/login");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    setFlash(res, "warn", "No account found with that email — register first.");
    return res.redirect("/register");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    setFlash(res, "error", "Incorrect email or password.");
    return res.redirect("/login");
  }

  const token = signToken({ email, userid: user._id });
  res.cookie(COOKIE_NAME, token);
  setFlash(res, "success", `Welcome back, ${user.name}!`);
  res.redirect("/");
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME);
  setFlash(res, "info", "You've been logged out.");
  res.redirect("/login");
}

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
