const stripe = require("stripe")("your_stripe_secret_key");
const axios = require("axios");
const {
  getPaypalAccessToken,
  createPaypalOrder,
} = require("../models/paymentMethodsModel");


module.exports ={
addCard: async (req, res) => {
  try {
    const { cardDetails } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardDetails.number,
        exp_month: cardDetails.expiryMonth,
        exp_year: cardDetails.expiryYear,
        cvc: cardDetails.cvc,
      },
    });

    res.status(200).send({ success: true, paymentMethodId: paymentMethod.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
},

paypal: async (req, res) => {
  try {
    const accessToken = await getPaypalAccessToken();
    const approvalUrl = await createPaypalOrder(accessToken);

    res.status(200).send({ url: approvalUrl });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
}
