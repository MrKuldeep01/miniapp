const mongoose = require("mongoose");
const connectionStr = "mongodb://127001:27017/miniProjectDB";
mongoose.connect(connectionStr)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error(err));
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
