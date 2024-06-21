const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.model");
const postModel = require("./models/post.model");
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

app.get("/", (req, res) => {
  // res.render('profile')
  res.render("register");
});

app.post("/reg", async (req, res) => {
  const { name, username, email, password, age, phone, img } = req.body;
  let passHash;
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.send("user is already exist..");
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.send(err);
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        res.send(err);
      }
      passHash = hash;
    });
  });
  const newUser = await userModel.create({
    name,
    username,
    email,
    password: passHash,
    age,
    phone,
    img,
  });
  jwt.sign(
    { email: newUser.email, userid: newUser._id },
    "shhhh",
    (err, token) => {
      if (err) {
        res.send;
      }
      res.cookie("token", token);
      res.redirect("/profile");
    }
  );
});
app.get("/profile", isLoging, async (req, res) => {
  res.render("profile");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  req.cookies("token", "");
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.send("something went wrong");
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      jwt.sign({ email: email, userid: user._id }, "shhhh", (err, token) => {
        if (err) {
          res.send;
        }
        res.cookie("token", token);
        res.redirect("/profile");
      });
    }
  });

  //   res.render("login");
});

app.get('/logout',(req,res)=>{
    req.cookies('token','')
    res.redirect('/login')
})

function isLoging(req, res, next) {
  const token = req.cookie("token");
  if (token) {
    next();
  }
  res.redirect("/login");
}
app.listen(3000);
