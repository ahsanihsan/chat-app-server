const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  messageType: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: Object
});

module.exports = mongoose.model("Message", messageSchema);
