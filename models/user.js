const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
<<<<<<< HEAD
=======
  username: {
    type: String,
    required: true,
    unique: true,
  },
>>>>>>> e4e2751 (Finished project)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
=======
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  dislikes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
>>>>>>> e4e2751 (Finished project)
});

module.exports = mongoose.model("User", UserSchema);