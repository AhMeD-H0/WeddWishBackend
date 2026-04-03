// //module.exports = () => ({});




// // module.exports = ({ env }) => ({
// //   upload: {
// //     config: {
// //       provider: 'local',
// //       providerOptions: {
// //         tmpWorkingDirectory: 'D:/strapi-temp', // مجلد آمن خارج AppData
// //       },
// //       breakpoints: {}, // خليه object فاضي بدل null
// //     },
// //   },
// // });

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: '@strapi/provider-email-nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT'),
        secure: env.bool('SMTP_SECURE', false),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM'),
        defaultReplyTo: env('SMTP_REPLY_TO'),
      },
    },
  },

  "users-permissions": {
    config: {
      register: {
        // هنحتاجها عشان instaPayNumber و address
        allowedFields: ["instaPayNumber", "address"],
      },
    },
  },
});




