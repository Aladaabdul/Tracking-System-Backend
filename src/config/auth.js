require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_KEY

const authenticateOffice = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.office = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
};


module.exports = {
    authenticateOffice
}