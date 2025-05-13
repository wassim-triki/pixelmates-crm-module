require('dotenv').config();
const twilio = require('twilio');

// Use the exact credentials provided by the user
const accountSid = 'AC4abd5c701e576ac1a4599557bc0dcc3d';
const authToken = '93858e8b62090cb5f2008b54f2f09578';
const twilioPhone = '+18316536130';

// Twilio configuration is set up

// Check if all required Twilio credentials are present
if (!accountSid || !authToken || !twilioPhone) {
  console.error('⚠️ WARNING: Missing Twilio credentials. SMS notifications will not work.');
}

// Function to test if credentials work
async function testTwilioCredentials() {
  try {
    // Try to create a client with the provided credentials
    const testClient = twilio(accountSid, authToken);

    // Make a simple API call to test authentication
    const account = await testClient.api.accounts(accountSid).fetch();
    return true;
  } catch (error) {
    return false;
  }
}

// Initialize the Twilio client
let client;
try {
  client = twilio(accountSid, authToken);

  // Test the credentials
  testTwilioCredentials().then(success => {
    if (success) {
      // If credentials work, check the phone number
      client.incomingPhoneNumbers.list({phoneNumber: twilioPhone})
        .then(() => {})
        .catch(() => {});
    }
  });
} catch (error) {
  // Failed to initialize client
}

// Send SMS when a complaint is resolved
exports.sendResolvedSMS = async (phoneNumber, complaintId) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Check if Twilio is authenticated
    if (!isTwilioAuthenticated) {
      throw new Error('Twilio is not authenticated. Please check your credentials.');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!formattedPhone) {
      throw new Error('Failed to format phone number');
    }

    if (!client) {
      throw new Error('Twilio client not initialized');
    }

    // Verify the phone number
    await verifyPhoneNumber(formattedPhone);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} has been resolved. Thank you for your feedback! - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Send SMS when a complaint is created
exports.sendNewComplaintSMS = async (phoneNumber, complaintId, restaurantName) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Check if Twilio is authenticated
    if (!isTwilioAuthenticated) {
      throw new Error('Twilio is not authenticated. Please check your credentials.');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!formattedPhone) {
      throw new Error('Failed to format phone number');
    }

    if (!client) {
      throw new Error('Twilio client not initialized');
    }

    // Verify the phone number
    await verifyPhoneNumber(formattedPhone);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} for ${restaurantName} has been received. We'll review it shortly. - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Send SMS when a complaint status is updated
exports.sendStatusUpdateSMS = async (phoneNumber, complaintId, status, restaurantName) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Check if Twilio is authenticated
    if (!isTwilioAuthenticated) {
      throw new Error('Twilio is not authenticated. Please check your credentials.');
    }

    // Format phone number if needed (ensure it has country code)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!formattedPhone) {
      throw new Error('Failed to format phone number');
    }

    if (!client) {
      throw new Error('Twilio client not initialized');
    }

    // Verify the phone number
    await verifyPhoneNumber(formattedPhone);

    const message = await client.messages.create({
      body: `Your complaint #${complaintId} for ${restaurantName} has been updated to: ${status}. - MenuFy Team`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    throw new Error('Failed to send SMS notification: ' + error.message);
  }
};

// Helper function to format phone numbers
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;

  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // For Tunisian numbers (assuming that's what we're dealing with)
  // Tunisian numbers are 8 digits, with country code +216
  if (cleaned.length === 8) {
    cleaned = '216' + cleaned;
  }
  // For US/Canada numbers
  else if (!cleaned.startsWith('1') && cleaned.length === 10) {
    cleaned = '1' + cleaned;
  }

  // Add + prefix if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

// Global variable to track if Twilio is authenticated
let isTwilioAuthenticated = false;

// Set the authentication status based on the test result
testTwilioCredentials().then(result => {
  isTwilioAuthenticated = result;
});

// Function to verify if a phone number is valid for Twilio
async function verifyPhoneNumber(phoneNumber) {
  // If Twilio is not authenticated, don't even try to verify
  if (!isTwilioAuthenticated) {
    return false;
  }

  try {
    // Check if the account is in trial mode
    const account = await client.api.accounts(accountSid).fetch();

    if (account.type === 'Trial') {
      // In trial mode, check if the phone number is verified
      const verifiedNumbers = await client.validationRequests.list();
      const isVerified = verifiedNumbers.some(vn => vn.phoneNumber === phoneNumber);

      if (!isVerified) {
        // Phone number not verified in trial account
        // We'll still try to send the SMS, but it might fail
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

// Test function to send a test SMS
exports.sendTestSMS = async (phoneNumber) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Check if Twilio is authenticated
    if (!isTwilioAuthenticated) {
      throw new Error('Twilio is not authenticated. Please check your credentials.');
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (!formattedPhone) {
      throw new Error('Failed to format phone number');
    }

    if (!client) {
      throw new Error('Twilio client not initialized');
    }

    // Verify the phone number
    await verifyPhoneNumber(formattedPhone);

    const message = await client.messages.create({
      body: `This is a test message from your MenuFy app. If you received this, SMS notifications are working correctly!`,
      from: twilioPhone,
      to: formattedPhone
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    throw new Error('Failed to send test SMS: ' + error.message);
  }
};