const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    productId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rating", ratingSchema);
