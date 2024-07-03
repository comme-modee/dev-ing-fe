import { io } from "socket.io-client";
const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND

const socket = io(REACT_APP_BACKEND);
// const socket = io(`http://localhost:5001`);

// const socket = io(REACT_APP_BACKEND_PROXY, {
//     path: '/socket.io',
//     // transports: ['websocket', 'polling'],
//     secure: true,
//     reconnection: true,
// });

export default socket;