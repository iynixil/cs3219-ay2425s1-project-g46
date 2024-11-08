// Established connection to the RabbitMQ
require("dotenv").config();
const amqp = require('amqplib');

const rabbitSettings = {
  protocol: process.env.RABBIT_PROTOCOL,
  hostname: process.env.RABBIT_HOSTNAME || 'localhost',
  port: process.env.RABBIT_PORT,
  username: process.env.RABBIT_USERNAME,
  password: process.env.RABBIT_PASSWORD,
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
};

const connectToRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(rabbitSettings);
    const channel = await conn.createChannel();

    return { conn, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

module.exports = connectToRabbitMQ;