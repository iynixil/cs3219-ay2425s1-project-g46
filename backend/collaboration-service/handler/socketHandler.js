// Author(s): Xue Ling, Xiu Jia, Calista, Andrew
const { getRandomQuestion, getComplexity } = require("../service/questionService");
const db = require("../config/firebase");

let socketMap = {};
let intervalMap = {};

let latestContentText = {};
let latestContentCode = {};
let latestLanguage = {}
let haveNewData = {};

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);


    socket.on("createSocketRoom", async ({ data, id, currentUser }) => {
      // Store the socket id for the user
      socketMap[currentUser] = socket.id;

      socket.join(id);
      console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);

      const room = io.sockets.adapter.rooms.get(id);

      if (room && room.size === 2) {
        const { user1, user2 } = data;

        const complexity = getComplexity(user1, user2);

        const questionData = await getRandomQuestion(user1.category, complexity);


        io.in(id).emit("readyForCollab", {
          id: id,
          user1,
          user2,
          questionData
        });

        console.log(`Room ${id} is ready. Collaboration question sent: ${questionData}`);



        // Save collaboration history for both users in "historyIndividual" collection
        const now = new Date();
        now.setHours(now.getHours() + 8); // Adjust to UTC+8    

        const historyData = {
          questionData,
          timestamp: now.toISOString(),
          collaborators: {
            user1: user1,
            user2: user2,
          },
          roomId: id,
          reviewGiven: false
        };

        try {
          // Add entry to user1's history
          const user1HistoryRef = db.collection("historyIndividual").doc(user1.email);
          const doc1 = await user1HistoryRef.get();
          if (!doc1.exists) {
            await user1HistoryRef.set({1: historyData});
          } else {
            const history = doc1.data();
            const historyKeys = Object.keys(history).map(Number);
            let maxKey = Math.max(...historyKeys);
            if (maxKey === -Infinity) {
              maxKey = 0;
            }
            await user1HistoryRef.update({[maxKey + 1]: historyData});
          }

          // Add entry to user2's history
          const user2HistoryRef = db.collection("historyIndividual").doc(user2.email);
          const doc2 = await user2HistoryRef.get();
          if (!doc2.exists) {
            await user2HistoryRef.set({1: historyData});
          } else {
            const history = doc1.data();
            const historyKeys = Object.keys(history).map(Number);
            let maxKey = Math.max(...historyKeys);
            if (maxKey === -Infinity) {
              maxKey = 0;
            }
            await user2HistoryRef.update({[maxKey + 1]: historyData});
          }
          console.log("Collaboration history saved for both users.");
        } catch (error) {
          console.error("Failed to save collaboration history: ", error);
        }

        

        // a timer to backup the current collab data
        const interval = setInterval(async () => {
          const currentTime = new Date().toISOString();
          const currentContentText = latestContentText[id];
          const currentContentCode = latestContentCode[id];
          const currentLanguage = latestLanguage[id] || null;
          const periodicData = {
            user1,
            user2,
            questionData,
            currentLanguage,
            currentContentText,
            currentContentCode,
            timestamp: currentTime
          };

          try {
            const collabRef = db.collection("collabs").doc(id);
            const doc = await collabRef.get();

            if (doc.exists) {
              if (haveNewData[id]) {
                haveNewData[id] = false;
                await collabRef.update(periodicData);
                console.log(`Collab Data updated to Firebase at ${currentTime}`);
              }
            } else {

              await collabRef.set({
                roomId: id,
                ...periodicData
              });
              console.log(`New Collab page recorded to Firebase at ${currentTime}`);
            }

          } catch (error) {
            console.error("Fail to save to database: ", error);
          }
        }, 5000);


        intervalMap[id] = interval;
      }
    });

    socket.on("sendContent", ({ id, content }) => {
      haveNewData[id] = true;
      latestContentText[id] = content;

      socket.to(id).emit("receiveContent", { content: content });
    });

    socket.on("sendCode", ({ id, code }) => {
      haveNewData[id] = true;
      latestContentCode[id] = code;
      socket.to(id).emit("receiveCode", { code: code });
    });

    socket.on("languageChange", ({ id, language }) => {
      haveNewData[id] = true;
      latestLanguage[id] = language;
      socket.to(id).emit("languageChange", { language });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Delete the 
      if (intervalMap[socket.id]) {
        clearInterval(intervalMap[socket.id]);
        delete intervalMap[socket.id];
      }
      if (socket.roomId) {
        delete latestContentText[socket.roomId];
        delete latestContentCode[socket.roomId];
        delete latestLanguage[socket.roomId];
        delete haveNewData[socket.roomId];
      }
      for (let user in socketMap) {
        if (socketMap[user] === socket.id) {
          delete socketMap[user];
          break;
        }
      }
      console.log(`User with socket ID ${socket.id} disconnected`);
    });


  });
};

// Export user functions
module.exports = { handleSocketIO };