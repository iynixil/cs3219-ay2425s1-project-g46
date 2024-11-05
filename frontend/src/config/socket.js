import { io } from "socket.io-client";

const matchingSocket = io(process.env.REACT_APP_MATCHING_SOCKET_URL || 'http://localhost:5002');
const collaborationSocket = io(process.env.REACT_APP_COLLABORATION_SOCKET_URL || 'http://localhost:5003');


export { matchingSocket, collaborationSocket };