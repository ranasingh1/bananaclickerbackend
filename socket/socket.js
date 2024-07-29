import express from "express";
import { Server } from "socket.io";
import http from "http";
import { User } from "../db/models/user.js";

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","https://bananaclickerfrontend-48ko.vercel.app"],
    methods: ["GET", "POST"],

  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("a new connection", socket.id);

  socket.emit("get-users", Object.values(onlineUsers));

  socket.on("userOnline", async (username) => {
    console.log("User online:", username);
    if (!onlineUsers[username]) {
      const user = await User.findOne({ username });
      onlineUsers[username] = {
        username,
        socketId: socket.id,
        bananaClicks: user ? user.bananaClicks : 0,
      };
      console.log("New user added:", onlineUsers);
    }
    io.emit("get-users", Object.values(onlineUsers));
  });

  socket.on("getInitialCount", async ({ username }) => {
    try {
      const user = await User.findOne({ username });
      if (user) {
        socket.emit("initialCount", user.bananaClicks);
      }
    } catch (error) {
      console.error("Error fetching initial banana count:", error);
    }
  });

  socket.on("getInitialRankings", async () => {
    try {
      const rankings = await User.find()
        .sort({ bananaClicks: -1 })
        .select("username bananaClicks")
        .lean();
      socket.emit("initialRankings", rankings);
    } catch (error) {
      console.error("Error fetching initial rankings:", error);
    }
  });

  socket.on("bananaClick", async ({ username }) => {
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { $inc: { bananaClicks: 1 } },
        { new: true }
      );

      if (onlineUsers[username]) {
        onlineUsers[username].bananaClicks = user.bananaClicks;
      }

      const updatedRankings = await User.find()
        .sort({ bananaClicks: -1 })
        .select("username bananaClicks")
        .lean();
      io.emit("updateRankings", updatedRankings);
      io.emit("updateCount", user.bananaClicks);
      io.emit("get-users", Object.values(onlineUsers)); 
    } catch (error) {
      console.error("Error updating banana count:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const [username, user] of Object.entries(onlineUsers)) {
      if (user.socketId === socket.id) {
        delete onlineUsers[username];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
    io.emit("get-users", Object.values(onlineUsers));
  });

  socket.on("userOffline", () => {
    for (const [username, user] of Object.entries(onlineUsers)) {
      if (user.socketId === socket.id) {
        delete onlineUsers[username];
        break;
      }
    }
    console.log("User went offline:", socket.id);
    io.emit("get-users", Object.values(onlineUsers));
  });
});

export { app, io, server };
