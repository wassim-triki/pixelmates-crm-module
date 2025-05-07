const sendEmail = require('./sendEmail');

/**
 * Send a notification email when a complaint status is updated
 * @param {Object} complaint - The complaint object
 * @param {Object} user - The user who submitted the complaint
 * @param {Object} restaurant - The restaurant the complaint is about
 * @param {String} note - Optional note about the status change
 * @param {String} baseUrl - Base URL for links in the email
 */
const sendStatusUpdateEmail = async (complaint, user, restaurant, note = '', baseUrl = 'http://localhost:3000/') => {
  // Define status colors for visual indication
  const statusColors = {
    'Pending': '#FFC107', // Yellow
    'In Progress': '#17A2B8', // Blue
    'Resolved': '#28A745', // Green
    'Closed': '#6C757D' // Gray
  };

  // Generate personalized note based on response content
  let personalizedNote = note;

  if (complaint.status === 'Resolved' && complaint.response) {
    const response = complaint.response.toLowerCase();

    // Check for common response types and provide personalized messages
    if (response.includes('replacement') || response.includes('replace')) {
      personalizedNote = "We are sorry for the inconvenience and would like to offer you a replacement. Your satisfaction is our priority.";
    } else if (response.includes('refund')) {
      personalizedNote = "We apologize for your experience and have processed a refund. We value your feedback and hope to serve you better in the future.";
    } else if (response.includes('discount') || response.includes('coupon')) {
      personalizedNote = "As a token of our appreciation for your feedback, we've added a special discount to your account for your next visit.";
    } else if (response.includes('fix') || response.includes('repair') || response.includes('correct')) {
      personalizedNote = "Thank you for bringing this issue to our attention. We've taken corrective action to fix the problem and improve our service.";
    } else if (response.includes('training') || response.includes('staff')) {
      personalizedNote = "We appreciate your feedback. We've addressed this with our staff and implemented additional training to ensure better service in the future.";
    } else {
      personalizedNote = "Thank you for your feedback. We've resolved your complaint and hope to provide you with a better experience next time.";
    }

    // Add the original note as additional information if it exists
    if (note && !note.includes('Status changed from')) {
      personalizedNote += " " + note;
    }
  }

  // Prepare data for the email template
  const emailData = {
    name: user.firstName || user.name || 'Customer',
    notificationType: 'status_update',
    complaintTitle: complaint.title,
    status: complaint.status,
    statusColor: statusColors[complaint.status] || '#000000',
    restaurantName: restaurant.name,
    category: complaint.category,
    response: complaint.response,
    note: personalizedNote,
    viewComplaintLink: `${baseUrl}/my-complaints?id=${complaint._id}`
  };

  // Send the email
  return sendEmail({
    to: user.email,
    subject: `Complaint Status Update: ${complaint.status}`,
    template: 'complaint-notification',
    data: emailData
  });
};

/**
 * Send a notification email when a new comment is added to a complaint
 * @param {Object} complaint - The complaint object
 * @param {Object} user - The user who submitted the complaint
 * @param {Object} comment - The new comment
 * @param {Object} commentAuthor - The user who added the comment
 * @param {String} baseUrl - Base URL for links in the email
 */
const sendNewCommentEmail = async (complaint, user, comment, commentAuthor, baseUrl = 'http://localhost:3000/') => {
  // Format the comment date
  const commentDate = new Date(comment.createdAt).toLocaleString();

  // Prepare data for the email template
  const emailData = {
    name: user.firstName || user.name || 'Customer',
    notificationType: 'new_comment',
    complaintTitle: complaint.title,
    commentText: comment.text,
    commentAuthor: commentAuthor.firstName || commentAuthor.name || 'Staff',
    commentDate: commentDate,
    viewComplaintLink: `${baseUrl}/my-complaints?id=${complaint._id}`
  };

  // Send the email
  return sendEmail({
    to: user.email,
    subject: `New Comment on Your Complaint`,
    template: 'complaint-notification',
    data: emailData
  });
};

/**
 * Send a follow-up email for a resolved complaint
 * @param {Object} complaint - The complaint object
 * @param {Object} user - The user who submitted the complaint
 * @param {String} baseUrl - Base URL for links in the email
 */
const sendFollowUpEmail = async (complaint, user, baseUrl = 'http://localhost:3000/') => {
  // Prepare data for the email template
  const emailData = {
    name: user.firstName || user.name || 'Customer',
    notificationType: 'follow_up',
    complaintTitle: complaint.title,
    ratingLink: `${baseUrl}/rate-complaint/${complaint._id}`,
    viewComplaintLink: `${baseUrl}/my-complaints?id=${complaint._id}`
  };

  // Send the email
  return sendEmail({
    to: user.email,
    subject: `Follow-up on Your Complaint`,
    template: 'complaint-notification',
    data: emailData
  });
};

module.exports = {
  sendStatusUpdateEmail,
  sendNewCommentEmail,
  sendFollowUpEmail
};