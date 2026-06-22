const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Sabse upar .env ko load karne ke liye

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Cleaned up for modern Mongoose)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Cloud connected successfully!'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

