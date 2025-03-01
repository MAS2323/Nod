// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   verified: {
//     type: Boolean,
//     default: false,
//   },
//   verificationToken: String,
//   addresses: [
//     {
//       name: String,
//       mobileNo: String,
//       houseNo: String,
//       street: String,
//       landmark: String,
//       city: String,
//       country: String,
//       postalCode: String,
//     },
//   ],
//   orders: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

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