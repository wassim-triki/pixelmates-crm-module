const express = require('express');
const Table = require('./models/Table');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database.js');
const restaurantRoutes = require('./routes/restaurant.routes.js');
const complaintRoutes = require('./routes/complaint.routes.js');
const complaintAnalyticsRoutes = require('./routes/complaint-analytics.routes.js');
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const errorHandler = require('./middlewares/error-handler.middleware.js');
const roleRoutes = require('./routes/role.routes.js'); // Add this line
const reservationRoutes = require('./routes/reservations.routes.js'); // Add this line
const passport = require('passport');
const tablesRoutes = require('./routes/table.routes.js');
const path = require('path');
const fs = require('fs').promises;

const loyaltyRoutes = require('./routes/loyaltyProgram.routes.js');
const rewardRoutes = require('./routes/reward.routes');
const redemptionRoutes = require('./routes/redemption.routes');

// Function to ensure the logo file exists in the public directory
async function ensureLogoExists() {
  try {
    // Create the public/images directory if it doesn't exist
    const imagesDir = path.join(__dirname, 'public/images');
    await fs.mkdir(imagesDir, { recursive: true });

    // Path to the destination logo file
    const logoDestPath = path.join(imagesDir, 'Logo-officiel-MenuFy.png');

    // Check if the logo already exists
    try {
      await fs.access(logoDestPath);
      console.log('✅ Logo file already exists in public directory');
    } catch (error) {
      // Logo doesn't exist, try to copy it from the back-office directory
      try {
        // Try to find the logo in various possible locations
        const possibleSourcePaths = [
          path.join(__dirname, '../../../back-office/src/assets/images/Logo-officiel-MenuFy.png'),
          path.join(__dirname, '../../back-office/src/assets/images/Logo-officiel-MenuFy.png'),
          path.join(__dirname, '../back-office/src/assets/images/Logo-officiel-MenuFy.png'),
          path.join(__dirname, '../../../public/images/Logo-officiel-MenuFy.png'),
          path.join(__dirname, '../../public/images/Logo-officiel-MenuFy.png')
        ];

        let copied = false;
        for (const sourcePath of possibleSourcePaths) {
          try {
            await fs.access(sourcePath);
            // If we get here, the file exists
            const logoData = await fs.readFile(sourcePath);
            await fs.writeFile(logoDestPath, logoData);
            console.log(`✅ Logo file copied from ${sourcePath} to public directory`);
            copied = true;
            break;
          } catch (err) {
            // File doesn't exist at this path, try the next one
            continue;
          }
        }

        if (!copied) {
          // If we couldn't find the logo, create a placeholder file
          console.warn('⚠️ Could not find logo file to copy. Creating a placeholder.');
          // Create a simple placeholder file
          await fs.writeFile(logoDestPath, 'Placeholder for logo file');
        }
      } catch (copyError) {
        console.error('❌ Error copying logo file:', copyError);
      }
    }
  } catch (error) {
    console.error('❌ Error ensuring logo exists:', error);
  }
}

dotenv.config();

// Fonction pour mettre à jour les documents existants
async function updateExistingDocuments() {
  try {
    const result = await Table.updateMany(
      { isReserved: { $exists: false } }, // Documents sans le champ isReserved
      { $set: { isReserved: false } } // Ajout du champ avec la valeur par défaut
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour des documents :', error);
  }
}
updateExistingDocuments();
//Connect to MongoDB
connectDB().then(() => {
  console.log('Connexion à la base de données réussie');
  updateExistingDocuments(); // Appel de la fonction ici
});

require('./config/googleAuth');
require('./config/facebookAuth');

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cookieParser()); // Parse cookies
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];

app.use(passport.initialize());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit requests per IP
    message: 'Too many requests, please try again later.',
  })
);

const PORT = process.env.PORT || 5000;

// Routes
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants/:restaurantId/tables', tablesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaint-analytics', complaintAnalyticsRoutes);

app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/redemptions', redemptionRoutes);




// Default route
app.get('/', (req, res) => {
  res.send('Pixelmates CRM Backend is running...');
});
app.use(errorHandler);

// Ensure the logo exists before starting the server
ensureLogoExists().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
