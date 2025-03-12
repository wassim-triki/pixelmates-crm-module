const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates REMOVE IN PRODUCTION
  },
});

module.exports = async function sendEmail({ to, subject, template, data }) {
  const templatePath = path.join(__dirname, `../templates/${template}.ejs`);
  const emailBody = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailBody,
  };

  return transporter.sendMail(mailOptions);
};
