const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const requireAuth = async (req, res, next) => {
  // Verify that user is authorized
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  console.log(token);
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 8 }).withMessage("Password too short"),
  ],
  async (req, res) => {
		// Check for validation errors, if there are any then 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors[0]);
    }
    try {
			// Check for existing user
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(403).json({ msg: "Email already in use." });
      } else {
				// Hash and salt password and save the user in the database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        await user.save();
				console.log("User "+user.email+" has been registered.")
        res.status(200).json({msg: "User has succesfully registered."});
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({msg: "Error in registering user"});
    }
  }
);

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user;
    try {
      user = await User.findOne({ email });
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, msg: "Problem in retrieving by username" });
    }
    if (!user) {
      return res.status(400).json({ success: false, msg: "Wrong username" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        JSON.parse(JSON.stringify(user)),
        process.env.SECRET,
        {
          expiresIn: 100000,
        }
      );
      res.status(200).json({
        success: true,
        token,
      });
    } else {
      return res.status(400).json({ success: false, msg: "Wrong password" });
    }
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

module.exports = router;
