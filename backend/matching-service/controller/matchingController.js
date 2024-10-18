// Author(s): Andrew, Xinyi
require('dotenv').config();
const express = require("express");
const app = express();
const db = require("../db/firebase");
const userCollection = db.collection("users");
const amqp = require('amqplib');
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

// RabbitMQ connection settings
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest', 
    password: process.env.rabbitPassword, 
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

// const queueTimersMap = {};

app.use(cors());
let socketMap = {};


const server = http.createServer(app);
// Initialize the Socket.IO server
const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins, adjust as needed
      methods: ["GET", "POST"],
    },
});
  

async function addUserToQueue(topic, difficultyLevel, email, token, username, isAny) {

    let queueKey = topic + " " + difficultyLevel;

    if (isAny) {
        queueKey = topic + " " + "any";

    }

    const message = {"email": email, "token": token, "username": username};

    try{

        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
        const res = await channel.assertQueue(queueKey);

        await channel.sendToQueue(queueKey, Buffer.from(JSON.stringify(message)), {
            expiration: `10000` // Timer for TTL
        });
        console.log(`Message sent to queue ${queueKey}`);

        // Close the channel and connection after processing
        await channel.close();
        await conn.close();

    } catch(err) {
        console.error(`Error -> ${err}`);
    }
}


async function checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny) {

    let queueKey = topic + " " + difficultyLevel;
    console.log(`is any: ${isAny}`);
    if (isAny) {
        queueKey = topic + " " + "any";

    }
    
    try{
        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
        const res = await channel.assertQueue(queueKey);

        const queueStatus = await channel.checkQueue(queueKey);
        console.log(`${queueKey} currently has ${queueStatus.messageCount} users`);
        if (queueStatus.messageCount >= 2) {
            
            const firstUser = await channel.get(queueKey, {noAck: false});
            if (!firstUser) {
                console.error("Failed to retrieve the first user.");
                return;
            }
            
            const secondUser =  await channel.get(queueKey, {noAck: false});
            if (!secondUser) {
                console.error("Failed to retrieve the second user.");
                channel.nack(firstUser, false, true); //Requeue the first user
                return;
            }
            
            const userList = [];
            
            const firstUserData = JSON.parse(firstUser.content.toString());
            const secondUserData = JSON.parse(secondUser.content.toString());
            
            userList.push(firstUserData);
            userList.push(secondUserData);

            channel.ack(firstUser);
            channel.ack(secondUser);

            return userList;

        }

        

        return null;
        // Close the channel and connection after processing
        await channel.close();
        await conn.close();
    } catch(err) {
        console.error(`Error -> ${err}`);
    }
}

async function checkMatchingAnyQueue(topic, difficultyLevel, email, token, isAny) {
    allDifficultyLevels = ["easy", "medium", "hard"];
    
    try{
        for (level in allDifficultyLevels) {
            queueKey = topic + " " + allDifficultyLevels[level];
            const conn = await amqp.connect(rabbitSettings);
            const channel = await conn.createChannel();
            const res = await channel.assertQueue(queueKey);

            const queueStatus = await channel.checkQueue(queueKey);
            if (queueStatus.messageCount > 0) {
                const firstUser = await channel.get(queueKey, {noAck: false});
                if (!firstUser) {
                    console.error("Failed to retrieve the first user.");
                    return;
                }
                
                
                const secondUser =  await channel.get((topic + " any"), {noAck: false});
                if (!secondUser) {
                    console.error("Failed to retrieve the second user.");
                    channel.nack(firstUser, false, true); //Requeue the first user
                    return;
                }
                
                const userList = [];
                
                const firstUserData = JSON.parse(firstUser.content.toString());
                const secondUserData = JSON.parse(secondUser.content.toString());
                
                userList.push(firstUserData);
                userList.push(secondUserData);

                channel.ack(firstUser);
                channel.ack(secondUser);

                return userList;

            }

            // Close the channel and connection after processing
            await channel.close();
            await conn.close();

        
        }
        return null;
    } catch(err) {
        console.error(`Error -> ${err}`);
    }
}

async function clearQueue(queueKey) {
    try {
        console.log(`Clearing queue ${queueKey}`);
        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
        await channel.assertQueue(queueKey);

        // Loop to clear all messages in the queue
        let message;
        while ((message = await channel.get(queueKey, { noAck: false })) !== false) {
            console.log(`Removing message from queue ${queueKey}`);
            channel.ack(message); // Acknowledge the message
        }


        await channel.close();
        await conn.close();
    } catch (error) {
        console.error(`Failed to clear queue ${queueKey}:`, error);
    }
}

async function removeUserFromQueue(topic, difficultyLevel, email, token) {
    queueKey = topic + " " + difficultyLevel;
        
    try {
        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
        const res = await channel.assertQueue(queueKey);

        const queueStatus = await channel.checkQueue(queueKey);
        // there should be only 1 person in queue
        // if > 2 people in queue, will be instantly matched
        if (queueStatus.messageCount < 2) {
            const user = await channel.get(queueKey, {noAck: false});
            if (!user) {
                console.error("No user in queue.");
                return;
            }

            const userData = JSON.parse(user.content.toString());
            channel.ack(user);

            // Close the channel and connection after processing
            await channel.close();
            await conn.close();

            // return user data
            return userData;
        }
    } catch (error) {
        console.error(`Failed to remove user from queue $(queueKey):`, error)
    }
}

const handleSocketIO = (io) => {
    io.on("connection", (socket) => {
      console.log(`A user connected with socket ID: ${socket.id}`);
  
      // Listen for the join_matching_queue event from the client
      socket.on("join_matching_queue", async (data) => {
        console.log(`New request for matching:`, data);
        const { topic, difficultyLevel, email, token, username, isAny } = data;
  
        // Store the socket ID for the user
        socketMap[email] = socket.id;
        
        // Add user to RabbitMQ queue (assuming you have the logic for this)
        await addUserToQueue(topic, difficultyLevel, email, token, username, isAny);
  
        // Check for a match
        const userList = await checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny);
  
        if (userList) {
            const [firstUser, secondUser] = userList;
    
            // Notify both users about the match
            io.to(socketMap[firstUser.email]).emit("match_found", { matchedData: secondUser });
            io.to(socketMap[secondUser.email]).emit("match_found", { matchedData: firstUser });
            console.log("A match is found");

        } else {
            console.log("I am here");
            const mixUserList = await checkMatchingAnyQueue(topic, difficultyLevel, email, token, username, isAny);

            if (mixUserList) {
                const [firstMixUser, secondMixUser] = mixUserList;
    
            // Notify both users about the match
            io.to(socketMap[firstMixUser.email]).emit("match_found", { matchedData: secondMixUser });
            io.to(socketMap[secondMixUser.email]).emit("match_found", { matchedData: firstMixUser });
            console.log("A match is found");
            }

        }
      });

      // Listen for cancel_matching event from client
      socket.on("cancel_matching", async (data) => {
        console.log(`Cancelling matching for user:`, data);
        const { topic, difficultyLevel, email, token } = data;

        // Store the socket ID for the user
        socketMap[email] = socket.id;

        // Remove user from RabbitMQ queue (assuming you have the logic for this)
        await removeUserFromQueue(topic, difficultyLevel, email, token);

      })
  
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User with socket ID ${socket.id} disconnected`);
      });
    });
  };



// Export user functions
module.exports = { handleSocketIO };
