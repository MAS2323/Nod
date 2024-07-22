const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    mobile: { type: String },
    password: { type: String },
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model('UserInfo', UserDetailsSchema);