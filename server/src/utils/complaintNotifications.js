const sendEmail = require('./sendEmail');

/**
 * Send a notification email when a complaint status is updated
 * @param {Object} complaint - The complaint object
 * @param {Object} user - The user who submitted the complaint
 * @param {Object} restaurant - The restaurant the complaint is about
 * @param {String} note - Optional note about the status change
 * @param {String} baseUrl - Base URL for links in the email
 */
const sendStatusUpdateEmail = async (complaint, user, restaurant, note = '', baseUrl) => {
  // Define status colors for visual indication
  const statusColors = {
    'Pending': '#FFC107', // Yellow
    'In Progress': '#17A2B8', // Blue
    'Resolved': '#28A745', // Green
    'Closed': '#6C757D' // Gray
  };

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
    note: note,
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
const sendNewCommentEmail = async (complaint, user, comment, commentAuthor, baseUrl) => {
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
const sendFollowUpEmail = async (complaint, user, baseUrl) => {
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
