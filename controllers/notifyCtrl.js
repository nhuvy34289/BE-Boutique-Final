const Notifies = require("../models/notifyModels");

const notifyCtrl = {
  createNewNotify: async (req, res) => {
    try {
      const { id, recipient, url, text, content, idUser } = req.body;

      const notify = new Notifies({
        id,
        recipient,
        url,
        text,
        content,
        user: idUser,
      });

      await notify.save();
      return res.json({ notify });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({ recipient: req.query.idUser })
        .sort("-createdAt")
        .populate("user", "avatar username");
      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  isReadNotify: async (req, res) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        { _id: req.query.id },
        {
          isRead: true,
        }
      );
      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeAllNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.deleteMany({
        recipient: req.query.idUser,
      });
      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = notifyCtrl;
