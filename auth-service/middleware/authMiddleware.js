const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('[Auth Middleware] Step 1 - Received Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth Middleware] No valid Bearer token found');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[Auth Middleware] Step 2 - Extracted Token:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[Auth Middleware] Step 3 - Decoded Token:', decoded);

      if (roles.length && !roles.includes(decoded.role)) {
        console.log('[Auth Middleware] Step 4 - Role not authorized:', decoded.role);
        return res.status(403).json({ msg: 'Forbidden - insufficient role' });
      }

      req.user = decoded;
      console.log('[Auth Middleware] Step 5 - Middleware passed to next()');
      next(); // Continue to the actual route handler

    } catch (err) {
      console.error('[Auth Middleware] JWT verification error:', err.message);
      res.status(401).json({ msg: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
