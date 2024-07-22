const express = require("express");
const router = express.Router();

const subcategoryController = require("../controllers/subcategoriesController");

// Obtener todas las subcategorías de una categoría específica
router.get(
  "/category/:categoryId",
  subcategoryController.getSubcategoriesByCategory
);

// Crear una nueva subcategoría en una categoría específica
router.post("/category/:categoryId", subcategoryController.createSubcategory);

// Obtener una subcategoría por su ID
router.get("/:subcategoryId", subcategoryController.getSubcategoryById);

// Actualizar una subcategoría por su ID
router.put("/:subcategoryId", subcategoryController.updateSubcategoryById);

// Eliminar una subcategoría por su ID
router.delete("/:subcategoryId", subcategoryController.deleteSubcategoryById);

module.exports = router;
