import { io } from "socket.io-client";
import { COLLABORATION_SOCKET_URL } from "./url";

const apiGatewaySocket = io("http://localhost:8000");
const collaborationSocket = io(COLLABORATION_SOCKET_URL || 'http://localhost:5003');


export { apiGatewaySocket, collaborationSocket };