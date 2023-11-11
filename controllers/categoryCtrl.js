const Categories = require("../models/categoryModels");

const categoryCtrl = {
  createNewCategory: async (req, res) => {
    try {
      const { content } = req.body;
      const oldCategory = await Categories.findOne({ content });
      if (oldCategory)
        return res.status(400).json({ msg: "This category already exists ! " });

      const newCategory = new Categories({ content });

      await newCategory.save();

      res.json({ msg: "Create newcategory successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { content } = req.body;
      await Categories.findOneAndUpdate(
        { _id: req.params.id },
        { content },
        { new: true }
      );
      res.json({ msg: "Update newcategory successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Categories.findOneAndDelete({ _id: req.params.id });
      res.json({ msg: "Update newcategory successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const categories = await Categories.find().sort("-createdAt");
      res.json({ categories });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
