const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Controller
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashErr) {
      console.error('Error hashing password:', hashErr);
      return res.status(500).json({ msg: 'Server error during password hashing' });
    }

    // Create and save user
    const user = new User({ name, email, password: hashedPassword, role });
    try {
      await user.save();
    } catch (saveErr) {
      console.error('Error saving user:', saveErr);
      return res.status(500).json({ msg: 'Error saving user to the database' });
    }

    res.status(201).json({ msg: 'Registered successfully' });
  } catch (err) {
    console.error('Unexpected error during registration:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    let isMatch;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (compareErr) {
      console.error('Error comparing passwords:', compareErr);
      return res.status(500).json({ msg: 'Error verifying credentials' });
    }

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    let token;
    try {
      token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (tokenErr) {
      console.error('Error generating token:', tokenErr);
      return res.status(500).json({ msg: 'Error generating authentication token' });
    }

    // Success response
    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Unexpected error during login:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Get User Info Controller
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Update Profile Controller
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// Delete Profile Controller
exports.deleteProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
