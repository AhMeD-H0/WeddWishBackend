'use strict';

module.exports = {
  async notifyRecipient(ctx) {
    const { userId, itemTitle, donorName, amount } = ctx.request.body;

    if (!userId || !itemTitle || !donorName || !amount) {
      return ctx.badRequest('Missing required fields');
    }

    // هات صاحب الwishlist
    const recipient = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { id: userId },
        select: ['email', 'username'],
      });

    if (!recipient?.email) {
      return ctx.notFound('Recipient email not found');
    }

    try {
      await strapi.plugin('email').service('email').send({
        to: recipient.email,
        subject: 'وصلك تبرع جديد 🎁',
        text:
          `New Gift.\n` +
          `item: ${itemTitle}\n` +
          `amount: ${amount} EGP\n` +
          `gifter name : ${donorName}\n`,
      });
    } catch (err) {
      strapi.log.error('Failed to send donation email', err);
      // خليه يرجع OK أو خطأ حسب ما تحب
      return ctx.internalServerError('Email send failed');
    }

    ctx.body = { ok: true };
  },
};