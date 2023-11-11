const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    content: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
