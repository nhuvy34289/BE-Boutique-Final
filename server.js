require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/mongoDB");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.use("/api", require("./routers/authRouter"));
app.use("/api", require("./routers/userRouter"));
app.use("/api", require("./routers/categoryRouter"));

//socket
const http = require("http").createServer(app);


//Routers


connectDB();

http.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
