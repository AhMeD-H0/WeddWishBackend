'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/instapay/otp/send',
      handler: 'api::instapay-otp.instapay-otp.send',
    },
    {
      method: 'POST',
      path: '/instapay/otp/verify',
      handler: 'api::instapay-otp.instapay-otp.verify',
    },
  ],
};
