import { io } from "socket.io-client";
const REACT_APP_BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY

// const socket = io(`${REACT_APP_BACKEND_PROXY}:5000`);

// console.log('소켓 주소', REACT_APP_BACKEND_PROXY)
const socket = io(REACT_APP_BACKEND_PROXY);

export default socket;