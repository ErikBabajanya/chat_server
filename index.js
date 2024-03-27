const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const authRoute = require("./auth/auth.route");
const chatRoute = require("./chat/chat.route");
const userRoute = require("./user/user.rotue");
const messagesRoute = require("./messages/messages.route");
const messageModel = require("./messages/messages.model");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const uri =
  "mongodb+srv://erikbabajanyan10:DzS7yINNlSUVjopI@tg.tp1sbow.mongodb.net/?retryWrites=true&w=majority&appName=Tg";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/user", userRoute);
app.use("/messages", messagesRoute);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const activeChatIds = [];
const activeUserIds = [];
io.on("connection", (socket) => {
  const chatId = socket.handshake.query.chatId;
  const userId = socket.handshake.query.userId;
  if (!activeUserIds.includes(userId)) {
    activeUserIds.push(userId);
    console.log("New userId added:", userId);
  }
  if (!activeChatIds.includes(chatId)) {
    activeChatIds.push(chatId);
    console.log("New chatId added:", chatId);
  }
  socket.join(chatId);
  socket.join(userId);
  console.log(activeChatIds);
  console.log(activeUserIds, "activeUserIds");

  socket.on("chat message", async ({ text, id, senderId, recipientId }) => {
    const message = new messageModel({
      chatId: id,
      senderId: senderId,
      recipientId: recipientId,
      text: text,
    });
    await message.save();
    activeChatIds.filter((chatId) => {
      if (chatId == id) {
        io.to(chatId).emit("chat message", { message });
      }
    });
    io.to(senderId).emit("chat message", { message });
    activeUserIds.filter((id) => {
      if (id == recipientId) {
        io.to(id).emit("chat message", { message });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const index = activeUserIds.indexOf(userId);
    if (index !== -1) {
      activeUserIds.splice(index, 1);
      console.log("userId removed:", userId);
    }
  });
});

server.listen(port, async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connection established");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
  }
  console.log(`Server running on port: ${port}`);
});
