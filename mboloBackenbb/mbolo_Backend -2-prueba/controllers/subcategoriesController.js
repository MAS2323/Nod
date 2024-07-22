const Subcategory = require("../models/subcategory");


module.exports = {
  // Obtener todas las subcategorías de una categoría específica
  getSubcategoriesByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const subcategories = await Subcategory.find({ category: categoryId });
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  },

  // Crear una nueva subcategoría en una categoría específica
  createSubcategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, descripcion, image, ubicacion, contacto } = req.body;
      const newSubcategory = new Subcategory({
        name,
        descripcion,
        image,
        ubicacion,
        contacto,
        category: categoryId,
      });
      await newSubcategory.save();
      res.status(201).json(newSubcategory);
    } catch (error) {
      console.error("Error creating subcategory:", error);
      res.status(500).json({ error: "Failed to create subcategory" });
    }
  },

  // Obtener una subcategoría por su ID
  getSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      res.status(500).json({ error: "Failed to fetch subcategory" });
    }
  },

  // Actualizar una subcategoría por su ID
  updateSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const { name, descripcion, image, ubicacion, contacto } = req.body;
      const updatedSubcategory = await Subcategory.findByIdAndUpdate(
        subcategoryId,
        { name, descripcion, image, ubicacion, contacto },
        { new: true }
      );
      if (!updatedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json(updatedSubcategory);
    } catch (error) {
      console.error("Error updating subcategory:", error);
      res.status(500).json({ error: "Failed to update subcategory" });
    }
  },

  // Eliminar una subcategoría por su ID
  deleteSubcategoryById: async (req, res) => {
    try {
      const { subcategoryId } = req.params;
      const deletedSubcategory = await Subcategory.findByIdAndDelete(
        subcategoryId
      );
      if (!deletedSubcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ error: "Failed to delete subcategory" });
    }
  },
};
