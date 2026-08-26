const mongoose = require("mongoose");
const { DEFAULT_USER_IMG } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: Number },
    img: { type: String, default: DEFAULT_USER_IMG },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
