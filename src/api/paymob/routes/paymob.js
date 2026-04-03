module.exports = {
  routes: [
    {
      method: "POST",
      path: "/paymob/create-payment",
      handler: "paymob.createPayment",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/paymob/webhook",
      handler: "paymob.webhook",
      config: {
        auth: false,
      },
    },
  ],
};