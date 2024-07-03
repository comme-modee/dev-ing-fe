import { io } from "socket.io-client";
const REACT_APP_BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY

// const socket = io(REACT_APP_BACKEND_PROXY);
const socket = io(`https://port-0-dev-ing-server-1272llwyghb5h.sel5.cloudtype.app`);

// const socket = io(REACT_APP_BACKEND_PROXY, {
//     path: '/socket.io',
//     // transports: ['websocket', 'polling'],
//     secure: true,
//     reconnection: true,
// });

export default socket;