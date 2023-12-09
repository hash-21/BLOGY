const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to create a Nodemailer transporter
exports.connect = () => {
  try {
    // transporter 
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    return transporter;
  } catch (error) {
    console.log(error);
  }
}