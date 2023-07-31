const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const User = require("./models/userModel");

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to accept JSON Data
app.use(cors());
app.get("/", (req, res) => {
  res.send("Working fine");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server is running on Port : ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", async (userData) => {
    socket.join(userData._id);
    users[socket.id] = userData._id;
    await User.findByIdAndUpdate(
      { _id: userData._id },
      { $set: { isOnline: true } }
    );
    io.emit("userStatusUpdate");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", async (userData) => {
    //console.log("User disconnected");
    const user_id = users[socket.id];
    console.log(socket.id);

    console.log("USER DISCONNECTED : ", user_id);

    await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { isOnline: false } }
    );

    io.emit("userStatusUpdate");
  });

  socket.off("setup", async () => {
    console.log("USER DISCONNECTED : ", userData._id);
    await User.findByIdAndUpdate(
      { _id: userData._id },
      { $set: { isOnline: false } }
    );
    socket.leave(userData._id);
  });
});
