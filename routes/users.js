const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const requireAuth = require("../middleware/requireauth");

// Route for registering a new user
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
      // Check for existing user by email or username
      const existingEmail = await User.findOne({ email: req.body.email });
      const existingUsername = await User.findOne({
        username: req.body.username,
      });

      if (existingEmail) {
        return res
          .status(403)
          .json({ success: false, msg: "Email already in use." });
      }

      if (existingUsername) {
        return res
          .status(403)
          .json({ success: false, msg: "Username already in use." });
      }
      // Hash and salt password and save the user in the database
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      await user.save();
      console.log("User " + user.email + " has been registered.");
      res
        .status(200)
        .json({ success: true, msg: "User has succesfully registered." });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ success: false, msg: "Error in registering user" });
    }
  }
);

// Route for handling login attempts
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Wrong username" });
    }
    // Check if password matches hashed password in database
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Attempt to create a token and send it back to the client
      try {
        // TODO: no way to refresh an expired token as of right now, need to create function for it.
        const token = jwt.sign(
          JSON.parse(JSON.stringify(user)),
          process.env.SECRET,
          {
            expiresIn: 10000000,
          }
        );
        res.status(200).json({
          success: true,
          email: user.email,
          token,
        });
      } catch (err) {
        res.status(404).json({
          error: err,
          success: false,
          msg: "There was a problem in creating the token",
        });
      }
    } else {
      return res.status(400).json({ success: false, msg: "Wrong password" });
    }
  } catch (err) {
    res.status(404).json({
      error: err,
      success: false,
      msg: "There was a problem in the request",
    });
  }
});

// Route for getting a single user
router.get("/user", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user_id });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
});

// Route for updating user information
router.put("/user/edit", requireAuth, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({
      username,
    });

    if (existingEmail) {
      return res
        .status(403)
        .json({ success: false, msg: "Email already in use." });
    }

    if (existingUsername) {
      return res
        .status(403)
        .json({ success: false, msg: "Username already in use." });
    }

    // Update user information
    user.username = username || user.username;
    user.email = email || user.email;

    // Only make new password if its provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, msg: "User information updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
