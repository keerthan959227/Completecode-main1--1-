const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token",token)

    const decoded = jwt.verify(token, process.env.jwt_secret);

    // console.log("decoded",decoded)

    req.body.userId = decoded._id;

    next();
  } catch (err) {
    res.status(401).send({ success: false, message: "Invalid token" });
  }
};
