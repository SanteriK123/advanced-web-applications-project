const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, required: true },
  user2: { type: Schema.Types.ObjectId, required: true },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);
