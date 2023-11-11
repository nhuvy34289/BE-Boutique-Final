const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    idUser: String,
    idProduct: String,
    nameProduct: String,
    priceProduct: String,
    sizeProduct: String,
    count: Number,
    img: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
