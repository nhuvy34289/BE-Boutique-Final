const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    imgs: { type: Array, required: true },
    categories: { type: Array, required: true },
    sizes: { type: Array, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    count: { type: Number, required: true },
    sold: { type: Number, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    ratings: [{ type: mongoose.Types.ObjectId, ref: "rating" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
