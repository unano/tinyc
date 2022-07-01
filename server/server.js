require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
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

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = socket(server, {
  pingTimeout:60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection",(socket)=>{
  console.log("connected to socket.io");
  socket.on('setup', (userData) =>{
    socket.join(userData._id);
    socket.emit('connected');
  })
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.broadcast.to(room).emit("typingBro"));
  socket.on("stop typing", (room) =>
    socket.broadcast.to(room).emit("stop typingBro")
  );

  socket.on('new message', (newMsgReceived) =>{
    var chat = newMsgReceived.chat;
    if(!chat.users) return console.log('chat.users not defined');
    chat.users.forEach(user => {
      if(user._id == newMsgReceived.sender._id) return;
      socket.in(user._id).emit('message received',newMsgReceived);
      
    });

  })
  socket.on("logout", (data) => {
    const userId = data;
    console.log(userId);
  });
})

