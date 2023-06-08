const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
});

exports.sendMailWithSendgrid = async (mailOptions) => {
  try {
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    console.log("mail sent");
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
  }
};
