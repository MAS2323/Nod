const Cart = require("../models/Cart");
const { getCachedData, setCachedData } = require("../utils/cache");

module.exports = {
  addToCart: async (req, res) => {
    const { userId, cartItem, quantity } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.cartItem.toString() === cartItem
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ cartItem, quantity });
        }

        await cart.save();
        setCachedData(`cart_${userId}`, cart, 60000); // Update cache
        res.status(200).json("Product added to cart");
      } else {
        const newCart = new Cart({
          userId,
          products: [{ cartItem, quantity }],
        });
        await newCart.save();
        setCachedData(`cart_${userId}`, newCart, 60000); // Update cache
        res.status(200).json("Product added to cart");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getCart: async (req, res) => {
    const userId = req.params.id;

    try {
      const cachedCart = getCachedData(`cart_${userId}`);
      if (cachedCart) {
        return res.status(200).json(cachedCart);
      }

      const cart = await Cart.findOne({ userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl"
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      setCachedData(`cart_${userId}`, cart, 60000); // Cache duration: 60 seconds
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteCartItem: async (req, res) => {
    const cartItemId = req.params.cartItemId;

    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { "products._id": cartItemId },
        { $pull: { products: { _id: cartItemId } } },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(404).json("Cart item not found");
      }

      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  decrementCartItem: async (req, res) => {
    const { userId, cartItem } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json("Carro no encontrado");
      }

      const existingProduct = cart.products.find(
        (product) => product.cartItem.toString() === cartItem
      );

      if (!existingProduct) {
        return res.status(404).json("Producto no encontrado");
      }

      if (existingProduct.quantity === 1) {
        cart.products = cart.products.filter(
          (product) => product.cartItem.toString() !== cartItem
        );
      } else {
        existingProduct.quantity -= 1;
      }

      await cart.save();

      if (existingProduct.quantity === 0) {
        await Cart.updateOne({ userId }, { $pull: { products: { cartItem } } });
      }

      res.status(200).json("Producto actualizado");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
