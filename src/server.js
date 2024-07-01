import { io } from "socket.io-client";
const REACT_APP_BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY

const socket = io(REACT_APP_BACKEND_PROXY);

export default socket;