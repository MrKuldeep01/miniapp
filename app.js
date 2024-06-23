const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user.model");
const postModel = require("./models/post.model");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// setting view engine
app.set("view engine", "ejs");
// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes

app.get("/", isLoging, async (req, res) => {
  jwt.verify(req.cookies.token, "shhhh", async (err, userData) => {
    if (err) {
      res.send(err);
    }
    const email = await userData.email;
    const currentUser = await userModel.findOne({ email });
    res.render("profile", { currentUser });
  });
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, username, email, password, age, phone, img } = req.body;
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.send("user is already exist..");
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.send(err);
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        res.send(err);
      }
      const newUser = await userModel.create({
        name,
        username,
        email,
        password: hash,
        age,
        phone,
        img,
      });
      const token = jwt.sign({ email: email, userid: newUser._id }, "shhhh");
      res.cookie("token", token);
      res.redirect("/");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  // res.cookie("token", "");
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.send("user is you need to register first");
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      jwt.sign({ email: email, userid: user._id }, "shhhh", (err, token) => {
        if (err) {
          res.send(err);
        }
        res.cookie("token", token);
        res.redirect("/");
      });
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/logout", (req, res) => {
  // res.cookie("token", "");
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/posts", async(req, res) => {
  const posts = await postModel.find()
  // console.log(posts);
  res.render("postShow",{posts});
});
app.get("/post/create", async (req, res) => {
  res.render("createPost");
});
app.post("/post/create", async (req, res) => {
  const { desc, img } = req.body;
  const post = await postModel.create({
    desc,
    img,
  });
  console.log(post);
  res.redirect("/posts");
});

function isLoging(req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/login");
  }
  next();
}

app.listen(3000);
