'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/donations/notify',
      handler: 'donation.notifyRecipient',
      config: {
        auth: false, // أو false للتجربة
      },
    },
  ],
};