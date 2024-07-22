const express = require("express");
const router = express.Router();

const categoriesRouter = require('../controllers/categoryController')

// Ruta para crear una nueva categoría (esta puede requerir autenticación si lo deseas)
router.post("/", categoriesRouter.createCategory);

// Ruta para obtener todas las categorías (no requiere autenticación)
router.get("/:id", categoriesRouter.getAllCategories);

module.exports = router;
