const express = require("express");
const requireAuth = require("../middleware/requireauth");
const Chat = require("../models/chat");
const User = require("../models/user");

const router = express.Router();

router.get("/mutual-likes", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("likes");
    // Filter through all the liked users likes, and if there is a match then return
    const mutualLikes = user.likes.filter((like) =>
      like.likes.includes(userId)
    );
    if (mutualLikes.length <= 0) {
      return res
        .status(500)
        .json({ success: false, msg: "No mutual likes, sorry!" });
    }
    return res.json(mutualLikes);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: error.message });
  }
});

router.get("/chat/:userId", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    let chat = await Chat.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId },
      ],
    });

    if (!chat) {
      chat = new Chat({
        user1: userId,
        user2: otherUserId,
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: error.message });
  }
});

router.post("/chat/:chatid", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatid;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, msg: "Message content is required" });
    }

    // Find other user from

    let chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, msg: "Chat not found" });
    }

    // Find users username

    const user = await User.findById(userId);

    const newMessage = {
      sender: user.username,
      content: content,
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: error.message });
  }
});

module.exports = router;
