// ChatList.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/chatlist.style.css";
import { useDispatch, useSelector } from "react-redux";
import chatActions from "../action/chatAction";

const chatRooms = [
    {
        id: 1,
        title: "이 문제 어케 풀어요",
        author: "민",
        replies: 11,
        lastMessage: "긴 문제",
    },
    {
        id: 2,
        title: "코드 리뷰 가능할까요??",
        author: "admin",
        replies: 2,
        lastMessage: "안녕하세요...",
    },
    // 다른 채팅방 데이터 추가
];

const ChatList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, chatRoomList } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(chatActions.getChatRoomList());
    }, []);

    console.log(chatRoomList);

    return (
        <div className="chat-list-container">
            <h1>채팅방 리스트</h1>
            {chatRoomList.length > 0 ? (
                chatRoomList.map((room) => (
                    <div
                        key={room._id}
                        className="chat-room-card"
                        onClick={() => navigate(`/chat/${room.roomId._id}`)}
                    >
                        <div className="chat-room-details">
                            <div className="chat-room-title">
                                {room.roomId.title}
                            </div>
                            <div className="chat-room-author">
                                {room.author}
                            </div>
                        </div>
                        <div className="chat-room-last-message">
                            {room.lastMessage}
                        </div>
                    </div>
                ))
            ) : (
                <h2>채팅방이 없습니다</h2>
            )}
        </div>
    );
};

export default ChatList;
