const Category = require("../models/Category");

module.exports = {
  // Controlador para crear una nueva categoría
  createCategory: async (req, res) => {
    try {
      const { name, imageUrl } = req.body;
      const newCategory = new Category({ name, imageUrl });
      await newCategory.save();
      res.status(201).json({
        message: "Categoría creada exitosamente",
        category: newCategory,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear la categoría", error: error.message });
    }
  },

 // Controlador para obtener todas las categorías
getAllCategories: async (req, res) => {
  try {
    // Consultar todas las categorías en la base de datos
    const categories = await Category.findById();

    // Validar si se encontraron categorías
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No se encontraron categorías" });
    }

    // Devolver las categorías como respuesta
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
}
};
