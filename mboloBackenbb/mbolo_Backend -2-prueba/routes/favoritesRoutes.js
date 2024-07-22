const router = require("express").Router();
const favoritesController = require("../controllers/favoritesController");

router.get("/:id", favoritesController.getFavorites);
router.post("/", favoritesController.addToFavorites);
router.delete("/:userId/:productId", favoritesController.removeFavorite);

module.exports = router;
