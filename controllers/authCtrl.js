const Users = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password, avatar } = req.query;

      const userName = await Users.findOne({ username });

      if (userName) {
        return res
          .status(400)
          .json({ msg: "This user name is already exists ! " });
      }

      const userEmail = await Users.findOne({ email });

      if (userEmail) {
        return res.status(400).json({ msg: "This email is already exists ! " });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        username,
        email,
        avatar,
        password: passwordHash,
      });

      await newUser.save();

      res.json({ msg: "Register successfull" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.query;

      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "This email does not exist !" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "This password is incorrect ! " });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Login Successfull",
        accessToken,
        refresh_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginWithAdmin: async (req, res) => {
    try {
      const { email, password } = req.query;
      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "This email does not exist !" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "This password is incorrect ! " });
      }

      if (user.isAdmin === false) {
        return res.status(400).json({ msg: "This user is not admin ! " });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      res.json({
        msg: "Login Successfull",
        accessToken,
        refresh_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const { refresh_token } = req.body;
      const rf_token = refresh_token.replace(/['"]+/g, "");

      if (!rf_token) return res.status(400).json({ msg: "Please login now." });
      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: "Please login now." });
          }

          const user = await Users.findById(result.id).populate(
            "favouriteProducts",
            "-password"
          );
          if (!user) {
            return res.status(400).json({ msg: "This does not exist." });
          }

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
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

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
