const express = require('express');
const Table = require('./models/Table');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database.js');
const restaurantRoutes = require('./routes/restaurant.routes.js');
const complaintRoutes = require('./routes/complaint.routes.js');
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const errorHandler = require('./middlewares/error-handler.middleware.js');
const roleRoutes = require('./routes/role.routes.js'); // Add this line
const reservationRoutes = require('./routes/reservations.routes.js'); // Add this line
const passport = require('passport');
const path = require('path');
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/complaints', complaintRoutes);
// Default route
app.get('/', (req, res) => {
  res.send('Pixelmates CRM Backend is running...');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
