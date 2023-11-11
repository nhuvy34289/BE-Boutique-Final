const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favouriteProducts: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
