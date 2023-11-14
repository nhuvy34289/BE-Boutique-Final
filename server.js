require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/mongoDB");
const SocketServer = require("./socketServer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 5000;


//socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  SocketServer(socket);
});

//Routers
app.use("/api", require("./routers/authRouter"));
app.use("/api", require("./routers/userRouter"));
app.use("/api", require("./routers/productRouter"));
app.use("/api", require("./routers/categoryRouter"));
app.use("/api", require("./routers/cartRouter"));
app.use("/api", require("./routers/historyRouter"));
app.use("/api", require("./routers/stripeRouter"));
app.use("/api", require("./routers/emailRouter"));
app.use("/api", require("./routers/messageRouter"));
app.use("/api", require("./routers/ratingRouter"));
app.use("/api", require("./routers/notifyRouter"));

connectDB();

http.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
