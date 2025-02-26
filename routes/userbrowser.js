const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireauth");
const User = require("../models/user");

// Route for retrieving a random user from the database
router.get("/browser", requireAuth, async (req, res) => {
  try {
    const originalUser = await User.findOne({ _id: req.user });
    if (!originalUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    // Exclude already liked and disliked users and the user itself
    const excludeIds = [
      ...originalUser.likes,
      ...originalUser.dislikes,
      originalUser._id,
    ];

    // Find a random user excluding the ones in the excludeIds
    const users = await User.aggregate([
      { $match: { _id: { $nin: excludeIds } } },
      { $sample: { size: 1 } },
    ]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No user found or all users interacted with",
      });
    }
    res.json(users[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.post("/browser/like", requireAuth, async (req, res) => {
  // Handle user liking another user
  // Original user here means the user that is doing the interaction
  const id = req.body._id;
  try {
    const originalUser = await User.findOne({ _id: req.user });
    if (!originalUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    // Make sure you can only like or dislike user once
    if (originalUser.dislikes.includes(id) || originalUser.likes.includes(id)) {
      return res
        .status(400)
        .json({ success: false, msg: "Cannot like a user multiple times" });
    }
    originalUser.likes.push(id);
    await originalUser.save();
    return res
      .status(200)
      .json({ success: true, msg: "User liked succesfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Server error in liking" });
  }
});

router.post("/browser/dislike", requireAuth, async (req, res) => {
  // Handle user disliking another user
  // Original user here means the user that is doing the interaction
  const id = req.body._id;
  try {
    const originalUser = await User.findOne({ _id: req.user });
    if (!originalUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    // Make sure you can only like or dislike user once
    if (originalUser.dislikes.includes(id) || originalUser.likes.includes(id)) {
      return res
        .status(400)
        .json({ success: false, msg: "Cannot like a user multiple times" });
    }
    originalUser.dislikes.push(id);
    await originalUser.save();
    return res
      .status(200)
      .json({ success: true, msg: "User disliked succesfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error in disliking" });
  }
});

module.exports = router;
