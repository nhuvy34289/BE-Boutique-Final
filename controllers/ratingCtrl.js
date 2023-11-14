const Ratings = require("../models/ratingModels");
const Products = require("../models/productModels");

const ratingCtrl = {
  createNewRating: async (req, res) => {
    try {
      const {
        productId,
        content,
        tag,
        reply,
        userAvatar,
        username,
        stars,
        userId,
      } = req.body;

      const product = await Products.findById(productId);
      if (!product) {
        return res.status(400).json({ msg: "The product does not exist." });
      }

      if (reply) {
        const rating = await Ratings.findById(reply);
        if (!rating) {
          return res.status(400).json({ msg: "This comment does not exist." });
        }
      }

      const newRating = new Ratings({
        userAvatar,
        content,
        stars,
        tag,
        reply,
        username,
        productId,
        user: userId,
      });

      const newProduct = await Products.findOneAndUpdate(
        {
          _id: productId,
        },
        {
          $push: { ratings: newRating._id },
        },
        { new: true }
      );

      const currentProduct = await Products.findOne({ _id: newProduct._id })
        .populate("likes", "avatar username ")
        .populate({
          path: "ratings",
          populate: {
            path: "likes",
            select: "-password",
          },
          options: { sort: { createdAt: -1 } },
        });

      await newRating.save();

      res.json({ newRating, currentProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateRating: async (req, res) => {
    try {
      const { content } = req.body;
      await Ratings.findOneAndUpdate(
        {
          _id: req.query.idRating,
          user: req.query._idUser,
        },
        { content }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likeRating: async (req, res) => {
    try {
      const { idRating, idUser } = req.body;

      const rating = await Ratings.findOne({ _id: idRating });

      if (rating.length > 0) {
        return res.status(400).json({ msg: "You liked this comment" });
      }

      const newRatings = await Ratings.findOneAndUpdate(
        { _id: idRating },
        { $push: { likes: idUser } },
        { new: true }
      ).populate("user", "avatar username ");

      res.json({ msg: "Liked Comment", newRatings });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikeRating: async (req, res) => {
    try {
      const { idRating, idUser } = req.body;

      await Ratings.findOneAndUpdate(
        { _id: idRating },
        {
          $pull: { likes: idUser },
        },
        { new: true }
      );

      res.json({ msg: "UnLiked Comment" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteRating: async (req, res) => {
    try {
      const { idRating } = req.query;

      const rating = await Ratings.findOneAndDelete({
        _id: idRating,
      });

      const product = await Products.findOneAndUpdate(
        { _id: rating.productId },
        { $pull: { ratings: rating._id } }
      );

      const newProduct = await Products.findOne({ _id: product._id });

      res.json({ msg: "Deleted Comment!", newProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = ratingCtrl;
