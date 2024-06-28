import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "../style/chatroom.style.css";
import { useSelector, useDispatch } from "react-redux";
import chatActions from "../action/chatAction";

const socket = io("http://localhost:5001"); // 서버 주소를 적절히 수정

const ChatRoom = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const { selectedChatRoom } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(chatActions.getChatRoom(roomId));
    }, []);

    useEffect(() => {
        // 특정 방에 입장
        socket.emit("join room", roomId);

        // 방에서 메시지 수신
        socket.on("chat message", (userName, message) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { userName, message },
            ]);
            dispatch(chatActions.saveChatMessage(roomId, userName, message));
        });

        // 클린업 함수
        return () => {
            socket.off("chat message");
        };
    }, [roomId]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (value.trim()) {
            socket.emit("chat message", {
                userName: user.userName,
                roomId,
                message: value,
            });
            setValue("");
        }
    };

    const handleChange = (evt) => {
        setValue(evt.target.value);
    };

    if (selectedChatRoom) {
        return (
            <div className="chat-room-container">
                <h1>{selectedChatRoom.roomId.title}</h1>
                <div className="chat-messages">
                    {selectedChatRoom.chat.map((message, index) => (
                        <div key={index} className="chat-message">
                            {message.userName}: {message.message}
                        </div>
                    ))}
                    {messages.map((message, index) => (
                        <div key={index} className="chat-message">
                            {message.userName}: {message.message}
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            value={value}
                            onChange={handleChange}
                        />
                        <button type="submit">전송</button>
                    </form>
                </div>
            </div>
        );
    } else {
        return <h1>채팅방이 없습니다</h1>;
    }
};

export default ChatRoom;
