const connectDB = require('../config/database');
const { ROLES } = require('../constants/roles');
const Role = require('../models/Role');
const seedRoles = async () => {
  try {
    await connectDB(); // Connect to DB

    for (const role of Object.values(ROLES)) {
      // ✅ Now it's iterable
      const existingRole = await Role.findOne({ name: role.name });
      if (existingRole) {
        await Role.updateOne(
          { name: role.name },
          { $set: { permissions: role.permissions } }
        );
        console.log(`🔄 Updated role: ${role.name}`);
      } else {
        await Role.create(role);
        console.log(`✅ Created role: ${role.name}`);
      }
    }

    console.log('🚀 Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedRoles();
