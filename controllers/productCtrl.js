const Products = require("../models/productModels");

const productCtrl = {
  createNewProduct: async (req, res) => {
    try {
      const { title, count, desc, discount, imgs, price, sizes, categories } =
        req.body;
      const product = await Products.findOne({ title });

      if (product) {
        return res.status(400).json({ msg: "This title is already exists ! " });
      }

      const newProduct = new Products({
        title,
        count,
        desc,
        discount,
        imgs,
        price,
        sizes,
        categories,
        sold: 0,
      });

      const savedProduct = await newProduct.save();
      res.json({
        msg: "Create successfully",
        savedProduct: {
          ...savedProduct._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        title,
        count,
        desc,
        discount,
        imgs,
        price,
        sizes,
        categories,
        productId,
      } = req.body;

      const updatedProduct = await Products.findOneAndUpdate(
        { _id: productId },
        {
          title,
          count,
          desc,
          discount,
          imgs,
          price,
          sizes,
          categories,
        },
        { new: true }
      );

      res.json({ msg: "Update successfully", updatedProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findOneAndDelete({ _id: req.query.id });
      res.json({ msg: "delete successfully", product });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await Products.find().sort("-createdAt");
      res.json({ products });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsByCategories: async (req, res) => {
    try {
      let products;

      const qCategory = req.body.category;
      const qSearch = req.body.search;

      if (qCategory) {
        products = await Products.find({
          categories: {
            $in: [qCategory],
          },
        }).sort("-createdAt");
      } else {
        products = await Products.find({ title: { $regex: qSearch } });
      }

      res.json({ products });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductPagination: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;

      const numberProduct = parseInt(req.query.count) || 1;

      const keyWordSearch = req.query.search;

      const category = req.query.category;

      const pageStart = (page - 1) * numberProduct;
      const pageEnd = page * numberProduct;

      let products;

      if (category === "All") {
        products = await Products.find().sort("-createdAt");
      } else {
        products = await Products.find({
          categories: {
            $in: [category],
          },
        });
      }

      const paginationProducts = products.slice(pageStart, pageEnd);

      if (!keyWordSearch) {
        res.json({ paginationProducts });
      } else {
        // const searchedProduct = await paginationProducts.find({
        //   title: { $regex: keyWordSearch },
        // });

        const searchedProduct = paginationProducts.filter((value) => {
          return (
            value.title.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !==
            -1
          );
        });

        res.json({ searchedProduct });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.query.id)
        .populate("likes", "avatar username ")
        .populate({
          path: "ratings",
          populate: {
            path: "user likes",
            select: "-password",
          },
          options: { sort: { createdAt: -1 } },
        });
      res.json({ product });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductRelated: async (req, res) => {
    try {
      const relatedProducts = await Products.find({
        categories: {
          $in: [req.query.category],
        },
      });

      res.json({ relatedProducts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
