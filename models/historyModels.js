const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cart: {
      type: Array,
      required: true,
    },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("history", historySchema);
