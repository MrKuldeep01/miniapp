const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

function getCreatePost(req, res) {
  res.render("createpost");
}

async function postCreatePost(req, res) {
  const { desc, img } = req.body;
  const currentUser = await userModel.findOne({ email: req.user.email });

  const post = await postModel.create({ desc, img, owner: currentUser._id });
  currentUser.post.push(post._id);
  await currentUser.save();

  res.redirect("/posts");
}

async function listPosts(req, res) {
  const posts = await postModel.find().populate("owner");
  if (posts.length === 0) {
    return res.redirect("/post/nothing");
  }
  res.render("postShow", { posts, currentUserId: req.user.userid });
}

function emptyPosts(req, res) {
  res.render("emptyPosts");
}

async function likePost(req, res) {
  const { postId } = req.params;
  const { userid } = req.user;
  const post = await postModel.findOne({ _id: postId });

  const likeIndex = post.likes.indexOf(userid);
  if (likeIndex === -1) {
    post.likes.push(userid);
  } else {
    post.likes.splice(likeIndex, 1);
  }
  await post.save();

  res.redirect("/posts");
}

async function deletePost(req, res) {
  const { postId } = req.params;
  const post = await postModel.findOne({ _id: postId });

  if (req.user.userid == post.owner) {
    const owner = await userModel.findOne({ _id: req.user.userid });
    owner.post.splice(owner.post.indexOf(postId), 1);
    await owner.save();
    await postModel.findOneAndDelete({ _id: postId });
  }

  res.redirect("/posts");
}

async function getEditPost(req, res) {
  const { postId } = req.params;
  const post = await postModel.findOne({ _id: postId });

  if (req.user.userid != post.owner) {
    return res.redirect("/posts");
  }
  res.render("editPost", { post });
}

async function postEditPost(req, res) {
  const { postId } = req.params;
  const { desc, img } = req.body;
  const post = await postModel.findOne({ _id: postId });

  await postModel.findOneAndUpdate(
    { _id: postId },
    {
      desc: desc || post.desc,
      img: img || post.img,
    }
  );
  res.redirect("/posts");
}

module.exports = {
  getCreatePost,
  postCreatePost,
  listPosts,
  emptyPosts,
  likePost,
  deletePost,
  getEditPost,
  postEditPost,
};
