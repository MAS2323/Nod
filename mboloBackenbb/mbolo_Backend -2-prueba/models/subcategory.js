const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: String,
    required: true,
  },
  contacto: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
