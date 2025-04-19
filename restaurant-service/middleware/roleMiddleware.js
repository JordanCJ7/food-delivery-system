module.exports = function (requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    next();
  };
};
