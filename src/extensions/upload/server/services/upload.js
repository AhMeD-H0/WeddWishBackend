"use strict";

const fs = require("fs");
const path = require("path");

module.exports = ({ strapi }) => ({
  async upload(file) {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // نحدد نوع الملف من ال request
    let folder = "misc";
    if (ctx.request.url.includes("profile")) folder = "images";
    if (ctx.request.url.includes("payment")) folder = "bills";

    // المسار النهائي
    const userFolder = path.join(strapi.dirs.static.public, "uploads", `user_${user.id}`, folder);

    // لو الفولدر مش موجود اعمله
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    // مسار الملف
    const filePath = path.join(userFolder, file.name);

    // انقل الملف
    fs.writeFileSync(filePath, file.buffer);

    // رجّع URL لستـرابي
    file.url = `/uploads/user_${user.id}/${folder}/${file.name}`;

    return file;
  },
});
