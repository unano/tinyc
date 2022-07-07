const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json("invalid token");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("no authentication");
  }
};


