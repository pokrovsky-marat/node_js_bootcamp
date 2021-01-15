const nodemailer = require("nodemailer");
module.exports = async (options) => {
  //1)Create a transporter
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2)Define email options
  const mailOptions = {
    from: "Marat Pokrovsky <pokrovsky@marat.net>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)Send email
  await transport.sendMail(mailOptions);
};
