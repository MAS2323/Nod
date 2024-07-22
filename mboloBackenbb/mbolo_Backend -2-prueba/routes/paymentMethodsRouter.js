const express = require("express");
const router = express.Router();
const paymentMethodsController = require("../controllers/paymentMethodsController");

router.post("/add-card", paymentMethodsController.addCard);
router.get("/paypal", paymentMethodsController.paypal);

module.exports = router;
