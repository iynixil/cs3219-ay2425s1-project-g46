import { io } from "socket.io-client";

const apiGatewaySocket = io("http://localhost:8000");


export { apiGatewaySocket };