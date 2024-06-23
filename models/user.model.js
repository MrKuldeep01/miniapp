const mongoose = require("mongoose");
const connectionStr = "mongodb://127.0.0.1:27017/miniProjectDB";
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
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
