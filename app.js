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

app.get("/", isLogin, async (req, res) => {
  const userData = req.user;
  const email = await userData.email;
  const currentUser = await userModel.findOne({ email });
  res.render("profile", { user: currentUser });
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
    res.send("<h1>You need to register first</h1>");
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

app.get("/posts", isLogin, async (req, res) => {
  const posts = await postModel.find().populate("owner");
  if (!posts) {
    res.redirect("/post/nothing");
  }
  res.render("postShow", { posts });
});

app.get("/profile/edit", isLogin, (req, res) => {
  res.render("editProfile");
});
app.post("/profile/edit", isLogin, async (req, res) => {
  jwt.verify(req.cookies.token, "shhhh", async (err, userData) => {
    if (err) {
      res.send(`<h2>${err}</h2>`);
    }
    let { name, phone, img } = req.body;
    const user = await userModel.findOne({ email: userData.email });
    name = name ? name : user.name;
    phone = phone ? phone : user.phone;
    img = img ? img : user.img;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userData.userid },
      {
        name,
        phone,
        img,
      }
    );
    res.redirect("/");
  });
});
app.get("/post/nothing", isLogin, (req, res) => {
  res.render("emptyPosts");
});
app.get("/post/create", isLogin, async (req, res) => {
  res.render("createPost");
});
app.post("/post/create", isLogin, async (req, res) => {
  const { desc, img } = req.body;
  jwt.verify(req.cookies.token, "shhhh", async (err, userData) => {
    if (err) {
      res.send(err);
    }
    const email = await userData.email;
    const currentUser = await userModel.findOne({ email });
    const post = await postModel.create({
      desc,
      img,
      owner: currentUser._id,
    });
    currentUser.post.push(post._id);
    await currentUser.save();
    res.redirect("/posts");
  });
});

app.get("/post/like/:postId", isLogin, async (req, res) => {
  const posts = await postModel.find();
  const post = await postModel.findOne({ _id: req.params.postId });
  const user = req.user;
  if (post.likes.indexOf(user.userid) === -1) {
    post.likes.push(user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(user.userid), 1);
  }
  await post.save();
  res.redirect("/posts");
});

app.get("/post/delete/:postId", isLogin, async (req, res) => {
  const postId = req.params.postId;
  const post = await postModel.findOne({ _id: postId });
  if (req.user.userid === post.owner) {
    await postModel.findOneAndDelete({ _id: postId });
  }
  res.redirect("/posts");
});

function isLogin(req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/login");
  }

  jwt.verify(req.cookies.token, "shhhh", (err, userData) => {
    if (err) {
      res.send(`<pre>${err}</pre>`);
    }
    req.user = userData;
    next();
  });
}

app.listen(3000);
