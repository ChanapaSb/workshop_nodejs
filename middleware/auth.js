const jwt = require('jsonwebtoken');

const middleware = {
  authToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          status: 401,
          message: 'Token not found', 
          success: false
        });
      }

      const token = authHeader.split(' ')[1];
      jwt.verify(token, 'jwtsecret', (err, user) => {
        if (err) {
          return res.status(400).json({ 
            status: 401,
            message: 'Token is incorrect', 
            success: false 
          });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      res.status(500).json({ 
        status: 500,
        message: error.message, 
        success: false 
      });
    }
  }
};

module.exports = { ...middleware };
