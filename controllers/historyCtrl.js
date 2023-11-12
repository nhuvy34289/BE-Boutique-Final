const Histories = require("../models/historyModels");
const Users = require("../models/userModels");
const historyCtrl = {
  createNewHistory: async (req, res) => {
    try {
      const newOrder = new Histories(req.body);
      const savedOrder = await newOrder.save();
      res.json({ savedOrder });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateHistory: async (req, res) => {
    try {
      const { _id, status, address } = req.body;

      const updatedHistory = await Histories.findByIdAndUpdate(
        { _id: _id },
        {
          address,
          status,
        },
        { new: true }
      );

      const user = await Users.findOne({ _id: updatedHistory.userId });

      res.json({ msg: "Update successfull", updatedHistory, user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteHistory: async (req, res) => {
    try {
      await Histories.findByIdAndDelete(req.query.id);
      res.json({ msg: "Delete successfull" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserHistories: async (req, res) => {
    try {
      const userHistories = await Histories.find({ userId: req.query.idUser });
      res.json({ userHistories });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllHistories: async (req, res) => {
    try {
      const allHistories = await Histories.find().sort("-createdAt");
      res.json({ allHistories });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMonthlyIcomes: async (req, res) => {
    try {
      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
      const previousMonth = new Date(
        new Date().setMonth(lastMonth.getMonth() - 1)
      );

      const income = await Histories.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);

      res.json({ income });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = historyCtrl;
