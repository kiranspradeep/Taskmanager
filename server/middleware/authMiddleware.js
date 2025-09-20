  const jwt = require('jsonwebtoken');
  const User = require('../models/User');

  const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if(!token) return res.status(401).json({ message: 'Unauthorized' });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch(err) {
      console.log(err);
      
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  module.exports = auth;
