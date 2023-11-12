const Messages = require("../models/messageModels");
const Users = require("../models/userModels");
const messageCtrl = {
  getMessages: async (req, res) => {
    try {
      const id_user1 = req.query.id_user1;
      const id_user2 = req.query.id_user2;

      const messages = await Messages.findOne({
        id_user1: id_user1,
        id_user2: id_user2,
      });

      res.json(messages);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllMessages: async (req, res) => {
    try {
      const messages = await Messages.find().sort("-createdAt");
      res.json({ messages });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendNewMessage: async (req, res) => {
    try {
      const id_user1 = req.body.id_user1;
      const id_user2 = req.body.id_user2;

      const data = {
        message: req.body.message,
        name: req.body.name,
        category: req.body.category,
        medias: req.body.medias,
      };

      const messages = await Messages.findOne({
        id_user1: id_user1,
        id_user2: id_user2,
      });

      messages.content.push(data);

      messages.save();

      res.send("Thành Công!");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createNewConversation: async (req, res) => {
    try {
      const id_admin = "618ab307528dab25eacc5797";

      const email = req.query.email;

      const user = await Users.findOne({ email: email });

      const id_user = user._id.toString();

      // Tạo ra 2 cuộc trò chuyện
      // 1 cái của admin
      const data1 = {
        id_user1: id_admin,
        id_user2: id_user,
        content: [],
      };

      // 1 cái của user
      const data2 = {
        id_user1: id_user,
        id_user2: id_admin,
        content: [],
      };

      Messages.insertMany(data1);

      Messages.insertMany(data2);

      res.send("Thanh Cong");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = messageCtrl;
