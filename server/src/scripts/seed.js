const { default: mongoose } = require('mongoose');
const connectDB = require('../config/database');
const { ROLES } = require('../constants/roles');
const Role = require('../models/Role');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const resetDB = async () => {
  console.log('\n🗑️  Resetting database...');
  await mongoose.connection.dropDatabase();
  console.log('✅ Database reset complete!');
};

const seedAll = async () => {
  try {
    // 1. Connect to DB once
    await connectDB();

    // 2. Check if we need to reset
    if (process.argv.includes('--reset')) {
      await resetDB();
    }

    // 3. Seed Roles
    console.log('🏗️  Seeding roles...');
    for (const role of Object.values(ROLES)) {
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

    // 4. Seed SuperAdmin
    console.log('\n👨💼 Seeding super admin...');
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });

    if (!superAdminRole) {
      throw new Error('SuperAdmin role not found - seed roles first');
    }

    const existingUser = await User.findOne({
      email: 'superadmin@themenufy.com',
    });

    if (!existingUser) {
      await User.create({
        firstName: 'Wassim',
        lastName: 'Triki',
        email: 'superadmin@themenufy.com',
        image:
          'https://scontent.ftun10-1.fna.fbcdn.net/v/t39.30808-1/473589161_2907329856110906_6008752793987387852_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=xX8MlThNGH8Q7kNvgEHodGv&_nc_oc=AdgehEQg7jSEgr9UgKTl2kTFDO2zGxCwUo_VMur9C-vh43sjsW8yd-GjWzLVwKThH-E&_nc_zt=24&_nc_ht=scontent.ftun10-1.fna&_nc_gid=AF6buVRsa9HmptAACq9FCNJ&oh=00_AYHhNjY7njCkoAmqS-qMYX9_x0tg0QciXuKV_Qa35pINQQ&oe=67D731E2',
        password: 'superadmin',
        role: superAdminRole._id,
        isVerified: true,
        status: 'Active',
        restaurantId: null,
      });
      console.log('✅ SuperAdmin created successfully');
    } else {
      console.log('ℹ️ SuperAdmin already exists');
    }

    console.log('\n🎉 All seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    // 5. Close connection once
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the complete seeding process
const runSeeding = async () => {
  await seedAll();
};

runSeeding();
