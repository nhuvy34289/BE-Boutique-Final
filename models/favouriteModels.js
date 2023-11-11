const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    idUser: String,
    products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("favourite", favouriteSchema);
