const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user.model");
const postModel = require("./models/post.model");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
// setting view engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
  const port =  process.env.PORT || 3000
// routes are completed ✅
app.get("/", isLogin, async (req, res) => {
  const userData = req.user;
  const email = userData.email;
  const user = await userModel.findOne({ email });
  console.log(userData)
  res.render("profile", { user });
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

  if (!email || !password) {
    console.log("both field are required");
    res.redirect("/login");
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    console.log(
      "please fill all field with correct data or register if new 😕"
    );
    res.redirect("/register");
  }
  else{
  
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result === true) {
      jwt.sign({ email: email, userid: user._id }, "shhhh", (err, token) => {
        if (err) {
          console.log(err, "error in signing");
        }
        res.cookie("token", token);
        res.redirect("/");
      });
    } else {
      console.log("wrong password");
      res.redirect('login')
    }
  })};
});

app.get("/logout", (req, res) => {
  // res.cookie("token", "");
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/posts", isLogin, async (req, res) => {
  const posts = await postModel.find().populate("owner");
  if (posts.length == 0) {
    res.redirect("/post/nothing");
  }
  res.render("postShow", { posts });
});

app.get("/post/nothing", isLogin, (req, res) => {
  res.render("emptyPosts");
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

app.get("/post/create", isLogin, async (req, res) => {
  res.render("createpost");
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
  if (req.user.userid == post.owner) {
    const owner = await userModel.findOne({_id:req.user.userid})
    owner.post.splice(owner.post.indexOf(postId),1);
    await owner.save();
    await postModel.findOneAndDelete({ _id: postId });
  }
  res.redirect("/posts");
});

app.get("/post/edit/:postId", isLogin, async (req, res) => {
  const postId = req.params.postId;
  const post = await postModel.findOne({ _id: postId });
  const userId = req.user.userid;
  userId == post.owner
    ? res.render("editPost", { postId })
    : res.redirect("/posts");
});

app.post("/post/edit/:postId", isLogin, async (req, res) => {
  const postId = req.params.postId;
  const post = await postModel.findOne({ _id: postId });
  const userId = req.user.userid;
  let { desc, img } = req.body;
  desc = desc ? desc : post.desc;
  img = img ? img : post.img;
  await postModel.findOneAndUpdate(
    { _id: postId },
    {
      desc,
      img,
    }
  );
  res.redirect("/posts");
});

function isLogin(req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/login");
  }
  let token =req.cookies.token; 
  jwt.verify(token, "shhhh", (err, userData) => {
    if (err) {
      res.send(err);
    }
    req.user = userData;
    next();
  });
}

app.listen(port,()=>{
  console.log(`application running on ${port}`)
});
