require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendResolvedSMS = async (phoneNumber, complaintId) => {
  try {
    const message = await client.messages.create({
      body: `Your complaint #${complaintId} has been resolved. Thank you for your feedback! - MenuFy Team`,
      from: twilioPhone,
      to: phoneNumber
    });
    
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS notification');
  }
};