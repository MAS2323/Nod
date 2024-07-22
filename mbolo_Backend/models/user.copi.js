const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    mobile: String,
    password: String,
    image: String,
    gender: String,
    profession: String,
    userType: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserDetailSchema);