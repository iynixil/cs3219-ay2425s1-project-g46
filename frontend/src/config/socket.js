import { io } from "socket.io-client";
import { COLLABORATION_SOCKET_URL, MATCHING_SOCKET_URL } from "./url";

const matchingSocket = io(MATCHING_SOCKET_URL || 'http://localhost:5002');
const collaborationSocket = io(COLLABORATION_SOCKET_URL || 'http://localhost:5003');


export { matchingSocket, collaborationSocket };