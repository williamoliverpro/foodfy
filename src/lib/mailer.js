const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bd6ac9ca0d3067",
      pass: "e20888c310f4ee"
    }
  })