const { default: mongoose } = require("mongoose");
const connectDB = require("../config/database");
const { ROLES } = require("../constants/roles");
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

const seedAll = async () => {
  try {
    // 1. Connect to DB once
    await connectDB();

    // 2. Seed Roles
    console.log("🏗️  Seeding roles...");
    for (const role of Object.values(ROLES)) {
      const existingRole = await Role.findOne({ name: role.name });
      if (existingRole) {
        await Role.updateOne(
          { name: role.name },
          { $set: { permissions: role.permissions } },
        );
        console.log(`🔄 Updated role: ${role.name}`);
      } else {
        await Role.create(role);
        console.log(`✅ Created role: ${role.name}`);
      }
    }

    // 3. Seed SuperAdmin
    console.log("\n👨💼 Seeding super admin...");
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    
    if (!superAdminRole) {
      throw new Error('SuperAdmin role not found - seed roles first');
    }

    const existingUser = await User.findOne({ 
      email:  'superadmin@themenufy.com'
    });

    if (!existingUser) {
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@themenufy.com',
        password: 'superadmin',
        role: superAdminRole._id,
        restaurantId: null
      });
      console.log('✅ SuperAdmin created successfully');
    } else {
      console.log('ℹ️ SuperAdmin already exists');
    }

    console.log("\n🎉 All seeding complete!");
    
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    // 4. Close connection once
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the complete seeding process
const runSeeding = async () => {
  await seedAll();
};

runSeeding();