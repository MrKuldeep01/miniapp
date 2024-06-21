const mongoose = require("mongoose");
mongoose.connect("mongodb://127001:27017");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    img: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    pass: {
      type: String,
      required: true,
      min: (6)["you can make password for 6 to 8 words.. "],
      max: (8)["you can make password for 6 to 8 words.. "],
    },
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
