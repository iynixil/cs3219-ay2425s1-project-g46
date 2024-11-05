// Author(s): Xiu Jia
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 8000;

// Create an instance of Express app
const app = express();
const server = http.createServer(app);

// Initialize the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust as needed
    methods: ["GET", "POST"],
  },
});

// Temporary
io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

const apiRoute = require("./routes/apiGatewayRoute.js")

app.use(express.json());
app.use(cors());

// Route
app.use("/api", apiRoute);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});