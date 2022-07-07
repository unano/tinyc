const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json("invalid token");
      req.user = user;
      console.log(user)
      next();
    });
  } else {
    res.status(401).json("no authentication");
  }
};


