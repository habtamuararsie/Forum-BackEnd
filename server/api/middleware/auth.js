const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    console.log(token);
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization access denied" });

    const verfied = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verfied);

    if (!verfied)
      return res
        .status(401)
        .json({
          msg: " Token Authentication verification failed, authorization failed",
        });
    req.id = verfied.id;
    next(); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = auth;
