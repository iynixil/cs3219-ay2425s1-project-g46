let socketMap = {};
let matchingService, collaborationService;

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    socket.on("matchingService", () => {
      console.log(`matching service connected with socket ID: ${socket.id}`);
      matchingService = socket.id;
    });

    socket.on("collaborationService", () => {
      collaborationService = socket.id;
    });

    // Listen for the join_matching_queue event from the client
    socket.on("join_matching_queue", async (data) => {
      console.log(`New request for matching:`, data);
      const { email } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      io.to(matchingService).emit("join_matching_queue", data);
    });

    socket.on("match_found", (data) => {
      const { user1, user2, matchData, id } = data;

      console.log("data", matchData);

      // Notify both users about the match
      io.to(socketMap[user1]).emit("match_found", {
        data: matchData,
        id,
      });

      io.to(socketMap[user2]).emit("match_found", {
        data: matchData,
        id,
      });
    });


    // Listen for cancel_matching event from client
    socket.on("cancel_matching", async (data) => {
      console.log(`Cancelling matching for user:`, data.email);
      const { email } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      io.to(matchingService).emit("cancel_matching", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
      socketMap = Object.fromEntries(
        Object.entries(socketMap).filter(([key]) => key !== socket.id)
      );
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };
