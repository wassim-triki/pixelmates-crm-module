import mongoose from 'mongoose';
const RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, // 'SuperAdmin', 'Admin', 'Employee', 'Client'
  permissions: [{ type: String }], // List of allowed actions (e.g., 'manage_users', 'manage_reservations')
});

module.exports = mongoose.model('Role', RoleSchema);
