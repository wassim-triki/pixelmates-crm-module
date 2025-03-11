const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database.js');
const restaurantRoutes = require('./routes/restaurant.routes.js');
const userRoutes = require('./routes/user.routes.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes.js');
const errorHandler = require('./middlewares/error-handler.middleware.js');

const roleRoutes = require('./routes/role.routes.js'); // Add this line
const session = require('express-session');  // 🔹 Sessions pour Passport
const passport = require('./config/passport.js'); // 🔹 Configuration Passport.js



dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cookieParser()); // Parse cookies
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit requests per IP
    message: 'Too many requests, please try again later.',
  })
);

// 🔹 Configurer les sessions (nécessaire pour Passport.js)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);
// 🔹 Initialiser Passport.js
app.use(passport.initialize());
app.use(passport.session());


const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes );

// Default route
app.get('/', (req, res) => {
  res.send('Pixelmates CRM Backend is running...');
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
