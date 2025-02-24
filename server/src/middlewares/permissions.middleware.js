const User = require("../models/User");
const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate("role");
      if (!user) return res.status(401).json({ error: "User not found" });

      const userPermissions = user.role.permissions;
      const hasPermission = requiredPermissions.some((p) =>
        userPermissions.includes(p),
      );

      if (!hasPermission) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = checkPermission;
