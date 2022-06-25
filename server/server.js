require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
//const socket = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoute');
const messageRoutes = require("./routes/messageRoute");
const chatRoutes = require("./routes/chatRoute");
app.use(cors());
app.use(express.json());


try {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connetion Successfull");
      });
  } 
  catch (err) {
    console.log(err.message);
  }


const PORT = process.env.port || 8080;
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
