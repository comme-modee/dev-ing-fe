import { io } from "socket.io-client";
const REACT_APP_BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY

// const socket = io(REACT_APP_BACKEND_PROXY);
const socket = io(`http://localhost:5001`);

// const socket = io(REACT_APP_BACKEND_PROXY, {
//     path: '/socket.io',
//     // transports: ['websocket', 'polling'],
//     secure: true,
//     reconnection: true,
// });

export default socket;