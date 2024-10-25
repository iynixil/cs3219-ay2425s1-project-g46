// Author(s): Xue Ling, Xiu Jia
const { getRandomQuestion, getComplexity } = require("../service/questionService");

let socketMap = {};

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    socket.on("createSocketRoom", async ({ data, id, currentUser }) => {
      // Store the socket id for the user
      socketMap[currentUser] = socket.id;

      const { user1, user2 } = data;

      const complexity = getComplexity(user1, user2);

      const questionData = await getRandomQuestion(user1.category, complexity);

      socket.join(id);

      console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);

      socket.emit("readyForCollab", {
        id: id,
        user1,
        user2,
        questionData
      });
    });

    socket.on("sendContent", ({ id, content }) => {
      socket.to(id).emit("receiveContent", { content: content });
    });

    socket.on("sendCode", ({ id, code }) => {
      socket.to(id).emit("receiveCode", { code });
    });

    socket.on("languageChange", ({ id, language }) => {
      socket.to(id).emit("languageChange", { language });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };