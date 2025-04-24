const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Decoded:', decoded);  // <-- Add this
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);  // <-- Add this
    res.status(401).json({ error: 'Invalid token' });
  }
};
