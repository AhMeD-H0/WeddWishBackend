const axios = require("axios");
const crypto = require("crypto");

module.exports = {
  async createPayment(ctx) {
    try {
      const { wishlistOwnerId, itemTitle, amount, donorName } = ctx.request.body;

      // 1️⃣ هات user
      const user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: { id: wishlistOwnerId },
      });

      if (!user) return ctx.badRequest("User not found");

      let wishlist = user.wishlist || [];

      const itemIndex = wishlist.findIndex(
        (item) => item.title.trim() === itemTitle.trim()
      );

      if (itemIndex === -1) return ctx.badRequest("Item not found");

      // 2️⃣ Auth token
      const authRes = await axios.post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key: process.env.PAYMOB_API_KEY,
        }
      );

      const authToken = authRes.data.token;

      // 3️⃣ Create order
      const orderRes = await axios.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: amount * 100,
          currency: "EGP",
          items: [],
        }
      );

      const orderId = orderRes.data.id;

      // 4️⃣ Create payment key
      const paymentKeyRes = await axios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          auth_token: authToken,
          amount_cents: amount * 100,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            first_name: donorName,
            last_name: "Donation",
            email: "donation@test.com",
            phone_number: "01000000000",
            country: "EG",
          },
          currency: "EGP",
          integration_id: process.env.PAYMOB_INTEGRATION_ID,
        }
      );

      const paymentToken = paymentKeyRes.data.token;

      // 5️⃣ أضف donor pending
      const newDonor = {
        id: orderId,
        name: donorName,
        amount: amount,
        status: "pending",
        paymobOrderId: orderId,
        paymobTransactionId: null,
      };

      wishlist[itemIndex].donors = wishlist[itemIndex].donors || [];
      wishlist[itemIndex].donors.push(newDonor);

      await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: wishlistOwnerId },
        data: { wishlist },
      });

      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

      ctx.send({ paymentUrl });
    } catch (err) {
      console.log(err);
      ctx.badRequest("Payment error");
    }
  },
    async webhook(ctx) {
    try {
      const data = ctx.request.body;

      if (!data.obj.success) return ctx.send("Not successful");

      const orderId = data.obj.order.id;
      const transactionId = data.obj.id;

      const users = await strapi.db.query("plugin::users-permissions.user").findMany();

      for (let user of users) {
        if (!user.wishlist) continue;

        for (let item of user.wishlist) {
          if (!item.donors) continue;

          const donor = item.donors.find(d => d.paymobOrderId == orderId);

          if (donor) {
            donor.status = "paid";
            donor.paymobTransactionId = transactionId;

            // احسب donated من جديد
            let sum = 0;
            for (let d of item.donors) {
              if (d.status === "paid") sum += d.amount;
            }

            item.donated = sum;

            await strapi.db.query("plugin::users-permissions.user").update({
              where: { id: user.id },
              data: { wishlist: user.wishlist },
            });

            break;
          }
        }
      }

      ctx.send("OK");
    } catch (err) {
      console.log(err);
      ctx.badRequest("Webhook error");
    }
  },
};