const Favorites = require("../models/Favorites");

module.exports = {
  addToFavorites: async (req, res) => {
    const { userId, productId } = req.body;

    try {
      let favorites = await Favorites.findOne({ userId });

      if (!favorites) {
        favorites = new Favorites({
          userId,
          products: [{ productId }],
        });
      } else {
        const productExists = favorites.products.find(
          (product) => product.productId.toString() === productId
        );
        if (!productExists) {
          favorites.products.push({ productId });
        }
      }

      await favorites.save();
      res.status(200).json("Producto agregado a favoritos");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getFavorites: async (req, res) => {
    const userId = req.params.id;

    try {
      const favorites = await Favorites.findOne({ userId }).populate(
        "products.productId",
        "_id title supplier price imageUrl"
      );

      if (!favorites) {
        return res.status(404).json({ message: "Favoritos no encontrados" });
      }

      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  removeFavorite: async (req, res) => {
    const { userId, productId } = req.params;

    try {
      const favorites = await Favorites.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true }
      );

      if (!favorites) {
        return res.status(404).json({ message: "Favoritos no encontrados" });
      }

      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
