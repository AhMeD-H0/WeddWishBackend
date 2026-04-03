'use strict';

module.exports = {
  async send(ctx) {
    const user = ctx.state.user;
    const { newNumber } = ctx.request.body;

    if (!user) return ctx.unauthorized('Login required');
    if (!newNumber) return ctx.badRequest('newNumber is required');

    // IMPORTANT: رقم واتساب لازم يكون E.164
    // لو انت بتخزن InstaPay كأرقام بدون +20، هنا هنركّبه
    // عدّل حسب صيغة أرقامك
    const phoneE164 = newNumber.startsWith('+') ? newNumber : `+20${newNumber}`;

    // (اختياري لكن مهم) خزّن الرقم pending لحد ما يتحقق
    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: { instaPayNumberPending: phoneE164 },
    });

    const result = await strapi
      .service('api::instapay-otp.instapay-otp')
      .sendOtp(phoneE164);

    ctx.send({ ok: true, status: result.status });
  },

  async verify(ctx) {
    const user = ctx.state.user;
    const { code } = ctx.request.body;

    if (!user) return ctx.unauthorized('Login required');
    if (!code) return ctx.badRequest('code is required');

    const freshUser = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      user.id,
      { fields: ['instaPayNumberPending'] }
    );

    if (!freshUser?.instaPayNumberPending) {
      return ctx.badRequest('No pending number');
    }

    const result = await strapi
      .service('api::instapay-otp.instapay-otp')
      .verifyOtp(freshUser.instaPayNumberPending, code);

    if (result.status !== 'approved') {
      return ctx.badRequest('Invalid or expired code');
    }

    // ✅ هنا فعلاً بنغير الرقم الأساسي
    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: {
        instaPayNumber: freshUser.instaPayNumberPending, // أو لو عايز تخزن بدون +20 عدّل
        instaPayNumberPending: null,
      },
    });

    ctx.send({ ok: true });
  },
};
