// Author(s): Andrew, Xinyi
const {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  removeUserFromQueue,
  removeUserFromPriorityQueue,
} = require("../controller/queueController");
const { createMatch } = require("../controller/matchController");

let socketMap = {};

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    // Store the socket ID for the user
    const storeSocket = (email) => {
      socketMap[email] = socket.id;
    };

    // Notify matched users
    const notifyUsers = (firstUser, secondUser, matchData, id) => {
      io.to(socketMap[firstUser.email]).emit("match_found", {
        data: matchData,
        id,
      });
      io.to(socketMap[secondUser.email]).emit("match_found", {
        data: matchData,
        id,
      });
      console.log(
        `Match found --> User1: ${firstUser.email}, User2: ${secondUser.email}`
      );
    };

    // Handle the matching logic based on the queue type
    const handleMatching = async (topic, difficultyLevel, email, token, username, isAny) => {
      try {
        storeSocket(email);

        // Add user to queue
        await addUserToQueue(topic, difficultyLevel, email, token, username, isAny);

        const userList = isAny 
          ? await checkMatchingAnyQueue(topic, difficultyLevel, email, token, username, isAny)
          : await checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny);

        if (userList && userList.length === 2) {
          const [firstUser, secondUser] = userList;
          const { status, msg, error, matchData, id } = await createMatch(firstUser, secondUser);

          if (status === 200) {
            console.log(msg);
            notifyUsers(firstUser, secondUser, matchData, id);
          } else {
            console.error(error || "Unknown error during match creation.");
          }
        }
      } catch (error) {
        console.error("Error in handleMatching:", error);
      }
    };

    // Handle join matching queue event
    socket.on("join_matching_queue", async (data) => {
      console.log(`New request for matching:`, data);
      const { topic, difficultyLevel, email, token, username, isAny } = data;
      await handleMatching(topic, difficultyLevel, email, token, username, isAny);
    });

    // Handle cancel matching event
    socket.on("cancel_matching", async (data) => {
      console.log(`Cancelling matching for user: ${data.email}`);
      const { topic, difficultyLevel, email, token, username, isAny } = data;
      
      try {
        storeSocket(email);

        // Remove user from RabbitMQ queue
        await removeUserFromQueue(topic, difficultyLevel, email, token, username, isAny);
        await removeUserFromPriorityQueue(topic, difficultyLevel, email, token, username, isAny);

        console.log(`User ${email} removed from the queue.`);
      } catch (error) {
        console.error("Error in cancel_matching:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
      // Optional: clean up socketMap if you want to remove disconnected users
      for (let email in socketMap) {
        if (socketMap[email] === socket.id) {
          delete socketMap[email];
          break;
        }
      }
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };
