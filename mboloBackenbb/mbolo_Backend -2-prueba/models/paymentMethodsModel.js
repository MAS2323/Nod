const axios = require("axios");

const PAYPAL_CLIENT_ID = "your_paypal_client_id";
const PAYPAL_CLIENT_SECRET = "your_paypal_client_secret";
const PAYPAL_API_BASE = "https://api.sandbox.paypal.com";

async function getPaypalAccessToken() {
  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    {
      grant_type: "client_credentials",
    },
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_CLIENT_SECRET,
      },
    }
  );

  return response.data.access_token;
}

async function createPaypalOrder(accessToken) {
  const order = await axios.post(
    `${PAYPAL_API_BASE}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const approvalUrl = order.data.links.find(
    (link) => link.rel === "approve"
  ).href;
  return approvalUrl;
}

module.exports = {
  getPaypalAccessToken,
  createPaypalOrder,
};
