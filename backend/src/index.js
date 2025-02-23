const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database.js');
const restaurantRoutes = require('./routes/restaurant.routes.js');
const userRoutes = require('./routes/user.routes.js');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Define routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Pixelmates CRM Backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
