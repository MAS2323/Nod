const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    product_location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // // Agregar campo de referencia al usuario
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
