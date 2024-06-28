import io from "socket.io-client";
import React, { useEffect, useRef, useState } from 'react'
import chatIcon from '../asset/img/chat-icon.png';
import '../style/chat.style.css';
import chatActions from "../action/chatAction";
import { useDispatch, useSelector } from 'react-redux';
import img from '../asset/img/meeting-img-01.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

const socket = io("http://localhost:5001"); // 서버 주소를 적절히 수정

const ChatBtn = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { chatRoomList, selectedChatRoom } = useSelector((state) => state.chat);
    const chatRoom = useRef(null);
    const chatIn = useRef(null);
    const [ roomId, setRoomId ] = useState(null);
    const [ value, setValue ] = useState("");
    const [ messages, setMessages ] = useState([]);

    useEffect(() => {
        dispatch(chatActions.getChatRoomList());

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (chatRoom.current && !chatRoom.current.contains(event.target) && !event.target.closest('.chat-icon')) {
            chatRoom.current.style.right = '-500px';
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            socket.emit("chat message", {
                userName: user.userName,
                roomId,
                message: value,
            });
            setValue("");
        }
    };

    const getSelectedChatRoom = (roomId) => {
        console.log(roomId)
        dispatch(chatActions.getChatRoom(roomId));
        setRoomId(roomId)
    }

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

    const handleChatRoom = () => {
        chatRoom.current.style.right = '0px';
    }

    return (
        <>
            {chatRoomList &&
                <div className='chat-room' ref={chatRoom}>
                    <div className='header'>채팅목록</div>
                    <div className='chat-list'>

                        {/* 채팅방 입장 */}
                        {/* <div className='chat-in' ref={chatIn}>
                            <div className='title'>타이틀</div>
                            <div className="chat-messages">
                                {selectedChatRoom?.chat.map((message, index) => (
                                    <div key={index} className="recipient">
                                        {message.userName}: {message.message}
                                    </div>
                                ))}
                                {messages?.map((message, index) => (
                                    <div key={index} className="sender">
                                        {message.userName}: {message.message}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <form onSubmit={handleSubmit} className='form-control'>
                                    <input
                                        type="text"
                                        placeholder="메시지를 입력하세요"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                    <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>
                                </form>
                            </div>
                        </div> */}


                        {/* 채팅방 목록 */}
                        {chatRoomList.map((chat) => 
                            <div key={chat._id} className='chat' onClick={() => getSelectedChatRoom(chat._id)}>
                                <div className='content'>
                                    <div className='left'>
                                        <div className='img'>
                                            <img src={img} alt=''/>
                                        </div>
                                        <div className='category'>독서</div>
                                    </div>
                                    <div className='right'>
                                        <div className='room-title'>
                                            <span className='title'>{chat.roomId.title}</span>
                                            <span className='participants-num'>{chat.participants.length}</span>
                                        </div>
                                        {/* <div className='room-latest-chat'>{chat.chat[chat.chat.length-1].message}</div> */}
                                    </div>
                                </div>
                                <div className='new'>1</div>
                            </div>
                        )}
                    </div>
                </div>
                }
            <div className="chat-icon" onClick={() => handleChatRoom()}>
                <img src={chatIcon} alt='채팅아이콘'/>
            </div>
        </>
    )
}

export default ChatBtn;
