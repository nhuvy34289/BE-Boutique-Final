const Users = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Products = require("../models/productModels");
const Messages = require("../models/messageModels");
const Carts = require("../models/cartModels");
const mailer = require("../mailer");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.query.idUser).populate(
        "favouriteProducts",
        "-password"
      );
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      // const query = req.query.new;

      // const users = query
      //   ? await Users.find().sort({ _id: -1 }).limit(5)
      //   : await Users.find();

      // res.status(200).json({ users });
      const users = await Users.find().sort("-createdAt");
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsersStats: async (req, res) => {
    try {
      const date = new Date();
      const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

      const data = await Users.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id_admin = "618ab307528dab25eacc5797";
      const user = await Users.findOne({ _id: req.query.idUser }).populate(
        "favouriteProducts",
        "-password"
      );

      if (user.favouriteProducts.length > 0) {
        user.favouriteProducts.forEach(async (product) => {
          await Products.findOneAndUpdate(
            { _id: product._id },
            { $pull: { likes: req.query.idUser } },
            {
              new: true,
            }
          );
        });
      }

      await Messages.findOneAndDelete({
        $and: [
          {
            id_user1: user._id,
            id_user2: id_admin,
          },
          {
            id_user1: id_admin,
            id_user2: user._id,
          },
        ],
      });

      await Carts.deleteMany({ idUser: req.query.idUser });

      await Users.findOneAndDelete({ _id: req.query.idUser });

      res.json({ msg: "delete successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addFavourite: async (req, res) => {
    try {
      const idUser = req.query.idUser;
      const idProduct = req.query.idProduct;
      const newFavourite = await Users.findOneAndUpdate(
        { _id: idUser },
        {
          $push: { favouriteProducts: idProduct },
        },
        {
          new: true,
        }
      ).populate("favouriteProducts", "-password");

      const product = await Products.findByIdAndUpdate(
        { _id: idProduct },
        {
          $push: { likes: idUser },
        }
      );

      const newProduct = await Products.findOne({ _id: product._id });

      res.json({
        msg: "Add item successfully",
        newFavourite,
        newProduct,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeFavourite: async (req, res) => {
    try {
      const idUser = req.query.idUser;
      const idProduct = req.query.idProduct;
      const newFavourite = await Users.findOneAndUpdate(
        { _id: idUser },
        {
          $pull: { favouriteProducts: idProduct },
        },
        {
          new: true,
        }
      ).populate("favouriteProducts", "-password");

      const product = await Products.findByIdAndUpdate(
        { _id: idProduct },
        {
          $pull: { likes: idUser },
        }
      );

      const newProduct = await Products.findOne({ _id: product._id });

      res.json({ msg: "Remove item successfully", newFavourite, newProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { _id, oldPassword, newPassword, userEmail } = req.body;

      const user = await Users.findOne({ email: userEmail });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "The old password is incorrect ! " });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await Users.findOneAndUpdate({ _id }, { password: passwordHash });

      res.json({ msg: "Change Password Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, username, email, _id } = req.body;

      const user = await Users.findOneAndUpdate(
        { _id },
        { username, avatar, email },
        { new: true }
      ).populate("favouriteProducts", "-password");

      res.json({ msg: "Update successfully", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserFromAdmin: async (req, res) => {
    try {
      const { username, email, _id } = req.body;

      const user = await Users.findOneAndUpdate(
        { _id },
        { username, email },
        { new: true }
      ).populate("favouriteProducts", "-password");

      res.json({ msg: "Update successfully", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePasswordFromAdmin: async (req, res) => {
    try {
      const { password, _id } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOneAndUpdate(
        { _id },
        { password: passwordHash },
        { new: true }
      ).populate("favouriteProducts", "-password");

      res.json({ msg: "Update successfully", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      }).populate("favouriteProducts", "-password");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.query.email });

      if (!user) {
        return res.status(400).json({ msg: "This email does not exist." });
      }
      const accessToken = createAccessToken({ id: user._id });
      const url = `${process.env.CLIENT_URL}/reset/${accessToken}`;
      const htmlResult = `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Boutique Shop.</h2>
      <p>Congratulations! You're almost set to start using my website.
          Just click the button below to validate your email address.
      </p>
      
      <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: block; text-align: center;">Click here !</a>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
      <div>${url}</div>
      <p>If you have any questions about our website, you can also click on the link below to contact us:</p>`;

      await mailer.sendMail(req.query.email, "Reset your password", htmlResult);

      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const token = req.query.token;
      const password = req.query.password;

      if (!token) {
        return res.status(400).json({ msg: "Invalid Authentication" });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded) {
        return res.status(400).json({ msg: "Invalid Authentication" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Your password must be at least 6 characters" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: decoded.id },
        {
          password: passwordHash,
        },
        { new: true }
      );

      res.json({ msg: "Password successfully changed,please login again !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userCtrl;
