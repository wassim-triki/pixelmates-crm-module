const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

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
  try {
    // Path to the logo file
    const logoPath = path.join(__dirname, '../../public/images/Logo-officiel-MenuFy.png');

    // Check if the logo file exists
    try {
      await fs.access(logoPath);
    } catch (error) {
      console.warn('Logo file not found at:', logoPath);
    }

    // Render the email template
    const templatePath = path.join(__dirname, `../templates/${template}.ejs`);

    // Add logo CID to the data
    const enhancedData = {
      ...data,
      logoUrl: 'cid:menufy-logo'
    };

    const emailBody = await ejs.renderFile(templatePath, enhancedData);

    // Create mail options with embedded logo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailBody,
      attachments: [
        {
          filename: 'Logo-officiel-MenuFy.png',
          path: logoPath,
          cid: 'menufy-logo' // Same cid value as in the html img src
        }
      ]
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
