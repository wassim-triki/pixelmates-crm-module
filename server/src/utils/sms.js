require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Send SMS when a complaint is resolved
exports.sendResolvedSMS = async (phoneNumber, complaintId) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} has been resolved. Thank you for your feedback! - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Send SMS when a complaint is created
exports.sendNewComplaintSMS = async (phoneNumber, complaintId, restaurantName) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} for ${restaurantName} has been received. We'll review it shortly. - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Send SMS when a complaint status is updated
exports.sendStatusUpdateSMS = async (phoneNumber, complaintId, status, restaurantName) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} for ${restaurantName} has been updated to: ${status}. - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Helper function to format phone numbers
function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the number already has a country code (assuming +1 for US/Canada)
  if (!cleaned.startsWith('1') && cleaned.length === 10) {
    cleaned = '1' + cleaned;
  }

  // Add + prefix if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}