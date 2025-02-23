const PERMISSIONS = {
  MANAGE_USERS: "manage_users", // SuperAdmins only
  MANAGE_RESTAURANTS: "manage_restaurants",
  MANAGE_RESERVATIONS: "manage_reservations",
  MANAGE_EMPLOYEES: "manage_employees",
  VIEW_RESERVATIONS: "view_reservations",
  HANDLE_COMPLAINTS: "handle_complaints",
  MAKE_RESERVATION: "make_reservation", // Clients only
  SUBMIT_COMPLAINT: "submit_complaint", // Clients only
};

module.exports = {
  PERMISSIONS,
};
