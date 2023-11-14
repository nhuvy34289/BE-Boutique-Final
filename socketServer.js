let users = [];
const Messages = require("./models/messageModels");
const idAdmin = "618ab307528dab25eacc5797";
const SocketServer = (socket) => {
  //Connect - Disconnect

  socket.on("joinUser", (user) => {
    users.push({ id: user._id, socketId: socket.id });
  });

  socket.on("disconnect", () => {
    const socketIdAdmin = users.filter((user) => user.id === idAdmin);
    if (socketIdAdmin) {
      const data = users.find(
        (user) => user.socketId === socket.id && user.id !== idAdmin
      );
      if (data) {
        socketIdAdmin.forEach((user) => {
          socket
            .to(`${user.socketId}`)
            .emit("checkUserOfflineToClient", data.id);
        });
      }
    }
    // if (data) {
    //   const newUsers = users.filter((user) => user.id !== data.id);
    //   newUsers.forEach((user) => {
    //     socket.to(`${user.socketId}`).emit("checkUserOfflineToClient", users);
    //   });
    // }
  });

  //Likes - UnLike Product

  socket.on("likeProduct", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("likeProductToClient", product);
    });
  });

  socket.on("unLikeProduct", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("unLikeProductToClient", product);
    });
  });

  // Carts

  socket.on("addToCart", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("addToCartToClient", product);
    });
  });

  socket.on("increaseCartItem", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("increaseCartItemToClient", product);
    });
  });

  socket.on("decreaseCartItem", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("decreaseCartItemToClient", product);
    });
  });

  socket.on("deleteCartItem", (product) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("deleteCartItemToClient", product);
    });
  });

  // Rating Product
  socket.on("ratingProduct", (rating) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("ratingProductToClient", rating);
    });
  });

  socket.on("deleteRatingProduct", (rating) => {
    users.forEach((user) => {
      socket.to(`${user.socketId}`).emit("deleteRatingProductToClient", rating);
    });
  });

  // Message
  socket.on("send_message", async (data) => {
    const newData = {
      id: Math.random().toString(),
      message: data.message,
      medias: data.medias,
      name: data.name,
      category: "receive",
    };

    const message = await Messages.findOneAndUpdate(
      {
        id_user1: data.id_user2,
        id_user2: data.id_user1,
      },
      {
        $push: { content: newData },
      },
      { new: true }
    );

    const newMessages = await Messages.findOne({ _id: message._id });

    socket.broadcast.emit("receive_message", newMessages);
  });

  //Notify
  socket.on("createNotify", (newMsg) => {
    const user = users.filter((user) => user.id === newMsg.recipient);
    user &&
      user.forEach((item) => {
        socket.to(`${item.socketId}`).emit("createNotifyToClient", newMsg);
      });
  });

  //Online - Offline
  socket.on("checkUserOnline", (data) => {
    const socketIdAdmin = users.filter((user) => user.id === idAdmin);
    socketIdAdmin &&
      socketIdAdmin.forEach((user) => {
        socket.to(`${user.socketId}`).emit("checkUserOnlineToClient", data);
      });
  });
};

module.exports = SocketServer;
