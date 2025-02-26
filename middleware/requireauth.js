const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  // Verify that user is authorized
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ success: false, msg: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, msg: "Request is not authorized" });
  }
};

module.exports = requireAuth
