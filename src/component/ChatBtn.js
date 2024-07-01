import React, { useEffect, useRef, useState } from 'react'
import chatIcon from '../asset/img/chat-icon.png';
import '../style/chat.style.css';
import chatActions from "../action/chatAction";
import { useDispatch, useSelector } from 'react-redux';
import img from '../asset/img/meeting-img-01.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import socket from '../server.js';

const ChatBtn = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { chatRoomList, selectedChatRoom } = useSelector((state) => state.chat);
    const [ roomId, setRoomId ] = useState(null);
    const [ value, setValue ] = useState("");
    const [ messages, setMessages ] = useState([]);
    const [ isGoBackBtnShow, setIsGoBackBtnShow ] = useState(false);
    const chatRoom = useRef(null);
    const chatIn = useRef(null);
    const messagesEndRef = useRef(null);
    
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

    //메세지가 업데이트될때마다 스크롤을 부드럽게 아래로 내림
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    //메세지가 업데이트될때마다 스크롤을 부드럽게 아래로 내림
    const enterChatRoomAndScrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    };

    useEffect(()=>{
        enterChatRoomAndScrollToBottom();
    },[selectedChatRoom])

    useEffect(() => {
        // 메시지가 업데이트될 때마다 스크롤을 맨 아래로 내림
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            socket.emit("chat message", {
                userName: user.userName,
                userProfileImage: user.profileImage,
                roomId,
                message: value
            });
            setValue("");
        }
    };

    const getSelectedChatRoom = (roomId) => {
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

    const backToChatRoomList = () => {
        getSelectedChatRoom('')
        setValue('')
        chatIn.current.style.display = 'none';
        setRoomId(null)
        setIsGoBackBtnShow(false)
    }

    const showChatIn = () => {
        chatIn.current.style.display = 'flex';
        setIsGoBackBtnShow(true);
        scrollToBottom();
    }

    return (
        <>
            {chatRoomList &&
                <div className='chat-room' ref={chatRoom}>
                    <div className='back-btn' onClick={() => backToChatRoomList()}>{isGoBackBtnShow ? <><FontAwesomeIcon icon={faChevronLeft}/> 채팅목록</> : <FontAwesomeIcon icon={faClose} onClick={() => chatRoom.current.style.right = '-500px'}/>}</div>
                    <div className={`${isGoBackBtnShow ? 'chat-room-title' : 'header'}`}>{isGoBackBtnShow ? selectedChatRoom?.roomId.title : '채팅목록'}</div>
                    <div className='chat-list'>

                        {/* 채팅방 입장 */}
                        <div className='chat-in' ref={chatIn}>
                            <div className="chat-messages">
                                {selectedChatRoom?.chat.map((message, index) => (
                                    <div key={`chat-${index}`} className={message.userName === user.userName ? "sender" : "recipient"}>
                                        {message.userName && message.message && message.userName === user.userName ? 
                                            <>
                                                <div className="right">
                                                    <span className="message">{message.message}</span>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="left small-profile-img"><img src={message.userProfileImage} alt=''/></div>
                                                <div className="right">
                                                    <span className="user">{message.userName}</span>
                                                    <span className="message">{message.message}</span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                ))}
                                {messages?.map((message, index) => (
                                    <div key={`message-${index}`} className={message.userName.userName === user.userName ? "sender" : "recipient"}>
                                        {message.userName.userName && message.userName.message && message.userName.userName === user.userName ? 
                                            <>
                                                <div className="right">
                                                    <span className="message">{message.userName.message}</span>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="left small-profile-img"><img src={message.userName.userProfileImage} alt=''/></div>
                                                <div className="right">
                                                    <span className="user">{message.userName.userName}</span>
                                                    <span className="message">{message.userName.message}</span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                ))}
                                <div ref={messagesEndRef}></div>
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
                        </div>


                        {/* 채팅방 목록 */}
                        {chatRoomList.map((chatRoom) => 
                            <div 
                                key={chatRoom?._id} 
                                className='chat' 
                                onClick={() => { 
                                    getSelectedChatRoom(chatRoom?.roomId?._id);
                                    showChatIn();
                                }}
                            >
                                <div className='content'>
                                    <div className='left'>
                                        <div className='img'>
                                            <img src={img} alt=''/>
                                        </div>
                                        <div 
                                            className={`category ${chatRoom?.roomId?.category === '독서' ? 'green' :
                                                                   chatRoom?.roomId?.category === '프로젝트' ? 'violet' :
                                                                   chatRoom?.roomId?.category === '강의' ? 'blue' : 'red'
                                            }`}>
                                            {chatRoom?.roomId?.category}
                                        </div>
                                    </div>
                                    <div className='right'>
                                        <div className='room-title'>
                                            <span className='title'>{chatRoom?.roomId?.title}</span>
                                            <span className='participants-num'>{chatRoom?.participants?.length}</span>
                                        </div>
                                        <div className='room-latest-chat'>{chatRoom?.chat[chatRoom.chat.length-1]?.message || ''}</div>
                                    </div>
                                </div>
                                {/* <div className='new'>1</div> */}
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
