const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      default:"https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/profile-website-icon.png"
    },
    desc: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
