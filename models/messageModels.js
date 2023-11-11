const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    id_user1: String,
    id_user2: String,
    content: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
