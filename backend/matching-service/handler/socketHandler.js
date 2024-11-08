// Author(s): Andrew, Xinyi
const {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  removeUserFromQueue,
  removeUserFromPriorityQueue,
} = require("../controller/queueController");
const { createMatch } = require("../controller/matchController");

const handleSocketIO = (apiGatewaySocket) => {
  apiGatewaySocket.emit("matchingService");

  // Listen for the join_matching_queue event from the client
  apiGatewaySocket.on("join_matching_queue", async (data) => {
    console.log(`New request for matching:`, data);
    const { topic, difficultyLevel, email, token, username, isAny } = data;

    // Store the socket ID for the user
    // socketMap[email] = socket.id;

    // Add user to RabbitMQ queue (assuming you have the logic for this)
    await addUserToQueue(
      topic,
      difficultyLevel,
      email,
      token,
      username,
      isAny
    );

    // Check for a match
    if (!isAny) {
      const userList = await checkMatchingSameQueue(
        topic,
        difficultyLevel,
        email,
        token,
        username,
        isAny
      );

      if (userList) {
        const [firstUser, secondUser] = userList;

        const { status, msg, error, matchData, id } = await createMatch(
          firstUser,
          secondUser
        );

        if (status == 200 && msg) {
          console.log(msg);
        } else if (status == 500 && error) {
          console.error(error);
        }

        apiGatewaySocket.emit("match_found", {
          user1: firstUser.email,
          user2: secondUser.email,
          matchData,
          id,
        });
        console.log(
          `A match is found: --> User1: ${firstUser.email}  --> User2: ${secondUser.email}`
        );
      }
    } else {
      const mixUserList = await checkMatchingAnyQueue(
        topic,
        difficultyLevel,
        email,
        token,
        username,
        isAny
      );

      if (mixUserList) {
        const [firstMixUser, secondMixUser] = mixUserList;

        const { status, msg, error, matchData, id } = await createMatch(
          firstMixUser,
          secondMixUser
        );

        if (status == 200 && msg) {
          console.log(msg);
        } else if (status == 500 && error) {
          console.error(error);
        }

        apiGatewaySocket.emit("match_found", {
          user1: firstMixUser.email,
          user2: secondMixUser.email,
          matchData,
          id,
        });
        console.log(
          `A match is found: --> User1: ${firstMixUser.email}  --> User2: ${secondMixUser.email}`
        );
      }
    }
  });

  // Listen for cancel_matching event from client
  apiGatewaySocket.on("cancel_matching", async (data) => {
    console.log(`Cancelling matching for user:`, data.email);
    const { topic, difficultyLevel, email, token, username, isAny } = data;

    // Remove user from RabbitMQ queue (assuming you have the logic for this)
    await removeUserFromQueue(
      topic,
      difficultyLevel,
      email,
      token,
      username,
      isAny
    );
    await removeUserFromPriorityQueue(
      topic,
      difficultyLevel,
      email,
      token,
      username,
      isAny
    );
  });
};

// Export user functions
module.exports = { handleSocketIO };
