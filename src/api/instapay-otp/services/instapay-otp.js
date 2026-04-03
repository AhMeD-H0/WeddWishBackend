'use strict';

const twilio = require('twilio');

module.exports = ({ strapi }) => ({
  _client() {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  },

  async sendOtp(phoneE164) {
    const client = this._client();
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneE164, channel: 'whatsapp' }); // WhatsApp OTP :contentReference[oaicite:3]{index=3}

    return { status: verification.status }; // غالباً pending
  },

  async verifyOtp(phoneE164, code) {
    const client = this._client();
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneE164, code });

    return { status: check.status }; // approved لو صح
  },
});
