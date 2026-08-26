const mongoose = require("mongoose");
const { DEFAULT_POST_IMG } = require("../constants");

const postSchema = new mongoose.Schema(
  {
    img: { type: String, default: DEFAULT_POST_IMG },
    desc: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
