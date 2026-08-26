const userModel = require("../models/user.model");

async function getProfile(req, res) {
  const user = await userModel.findOne({ _id: req.user.userid }).populate("post");
  res.render("profile", { user, isOwner: true });
}

async function getAccount(req, res) {
  const { id } = req.params;
  if (req.user.userid === id) {
    return res.redirect("/");
  }

  const guest = await userModel.findOne({ _id: id });
  res.render("profile", { user: guest, isOwner: false });
}

async function getEditProfile(req, res) {
  const user = await userModel.findOne({ _id: req.user.userid });
  res.render("editProfile", { user });
}

async function postEditProfile(req, res) {
  const { userid } = req.user;
  const user = await userModel.findOne({ _id: userid });
  const { name, phone, img } = req.body;

  await userModel.findOneAndUpdate(
    { _id: userid },
    {
      name: name || user.name,
      phone: phone || user.phone,
      img: img || user.img,
    }
  );
  res.redirect("/");
}

module.exports = { getProfile, getAccount, getEditProfile, postEditProfile };
