module.exports = [
    'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: ['*'],
      headers: '*',
    }
  },
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

// module.exports = [
//   'strapi::errors',

//   {
//     name: 'strapi::cors',
//     config: {
//       origin: ['*'], // للتجربة فقط
//       headers: ['Content-Type', 'Authorization', 'Accept'],
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//       credentials: false,
//     },
//   },

//   'strapi::security',
//   'strapi::poweredBy',
//   'strapi::logger',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];

