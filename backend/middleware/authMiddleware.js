const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'hackathon_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (token === 'demo-token') { // For fallback mock
      req.user = { id: '1' };
      return next();
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
