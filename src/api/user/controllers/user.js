module.exports = {
  async search(ctx) {
    const query = ctx.query.q || "";

    const users = await strapi.db.query("plugin::users-permissions.user").findMany({
      where: {
        username: {
          $containsi: query,
        },
      },
      populate: ["profileImage"],
    });
    console.log(users);

    return users;
  },
};
