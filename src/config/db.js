const mongoose = require("mongoose");
const { dbUri } = require("./env");

async function connectDB() {
  await mongoose.connect(dbUri);
  console.log("MongoDB connected successfully");
}

module.exports = connectDB;
