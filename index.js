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
const redis = require("redis");
require("events").EventEmitter.defaultMaxListeners = 15;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URL;
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
const client = redis.createClient({
  password: "NsraI6eAOiYQKZNIkfKx94c3bxJJ6ihv",
  socket: {
    host: "redis-14447.c257.us-east-1-3.ec2.cloud.redislabs.com",
    port: 14447,
  },
});
client.connect();
client.on("error", (err) => console.log("Redis Client Error", err));

client.on("connect", () => {
  console.log("Connected to Redis server");
});

client.on("ready", () => {
  console.log("Redis client is ready");
  client.set("framework", "ReactJS", function (err, reply) {
    console.log(reply); // OK
  });

  client.get("framework", function (err, reply) {
    console.log(reply); // ReactJS
  });
});

client.on("end", () => {
  console.log("Redis client connection has ended");
});

const activeChatIds = {};
const activeUserIds = {};
const unreadeMsg = {};
io.on("connection", (socket) => {
  socket.on("userLoggedIn", async (userId) => {
    if (userId) {
      activeUserIds[userId] = true;
      socket.join(userId);
      if (unreadeMsg[userId]) {
        const senderIds = Object.keys(unreadeMsg[userId]);
        let unread = [];
        senderIds.forEach(() => {
          unread.push(unreadeMsg[userId]);
        });
        io.to(userId).emit("unreadMsg", unread);
      } else {
        console.log(`User ${userId} has no unread messages.`);
      }
    }
  });

  socket.on("chat connect", (chatId, userId) => {
    if (chatId && userId) {
      if (!activeChatIds[chatId]) {
        activeChatIds[chatId] = [userId];
      } else {
        if (!activeChatIds[chatId].includes(userId)) {
          activeChatIds[chatId].push(userId);
        }
      }
      socket.join(chatId);
    }
  });
  socket.on("close chat", (chatId, userId) => {
    if (activeChatIds[chatId]) {
      const index = activeChatIds[chatId].indexOf(userId);
      if (index !== -1) {
        activeChatIds[chatId].splice(index, 1);
      }
      if (activeChatIds[chatId].length === 0) {
        delete activeChatIds[chatId];
      }
    }
  });

  socket.on("chat message", async ({ text, id, senderId, recipientId }) => {
    const message = new messageModel({
      chatId: id,
      senderId: senderId,
      recipientId: recipientId,
      text: text,
    });

    await message.save();
    io.to(id).emit("chat message", { message });
    io.to(senderId).emit("lastMessage", { message });
    io.to(recipientId).emit("lastMessage", { message });
    if (!activeChatIds[id].includes(recipientId)) {
      if (!unreadeMsg.hasOwnProperty(recipientId)) {
        unreadeMsg[recipientId] = {};
      }
      if (!unreadeMsg[recipientId].hasOwnProperty(senderId)) {
        unreadeMsg[recipientId][senderId] = 1;
      } else {
        unreadeMsg[recipientId][senderId]++;
      }
      console.log(unreadeMsg);
    }
  });

  socket.on("writingMsg", ({ sender, recipient }) => {
    io.to(recipient).emit("writingMsg", sender);
  });
  socket.on("stopWritingMsg", ({ sender, recipient }) => {
    io.to(recipient).emit("stopWritingMsg", sender);
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(activeUserIds).find(
      (key) => activeUserIds[key] === socket.id
    );

    if (userId) {
      delete activeUserIds[userId];

      socket.leave(userId);
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
