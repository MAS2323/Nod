const router = require("express").Router();
const cartController = require('../controllers/cartControllers');

router.get('/find/:id', cartController.getCart);
router.post("/", cartController.addToCart);
router.post("/quantity", cartController.decrementCartItem);

router.delete("/:cardItemId", cartController.deleteCartItem);







module.exports = router;