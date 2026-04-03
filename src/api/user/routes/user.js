module.exports = {
  routes: [
    {
      method: "GET",
      path: "/search-users",
      handler: "user.search",
      config: {
        auth: false, // أو true حسب رغبتك
      },
    },
  ],
};
