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

app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/user", userRoute);
app.use("/messages", messagesRoute);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  // Pass the HTTP server instance to socket.io
  cors: {
    origin: "http://localhost:3000", // Change to the origin of your frontend application
    methods: ["GET", "POST"],
  },
});

const activeChatIds = [];

io.on("connection", (socket) => {
  const chatId = socket.handshake.query.chatId;

  if (!activeChatIds.includes(chatId)) {
    activeChatIds.push(chatId);
    console.log("New chatId added:", chatId);
  }
  socket.join(chatId);
  console.log(activeChatIds);
  console.log("A user connected");

  socket.on("chat message", async ({ text, id, senderId }) => {
    const message = new messageModel({
      chatId: id,
      senderId: senderId,
      text: text,
    });
    await message.save();
    activeChatIds.filter((chatId) => {
      if (chatId == id) {
        io.to(chatId).emit("chat message", { text, chatId, senderId });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
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
