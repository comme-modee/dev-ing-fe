import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/home.style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const HomeMeetUpCard = ({ meetUp }) => {
    const navigate = useNavigate();

    const goToMeetUpDetail = () => {
        navigate(`/meetUp/${meetUp._id}`);
    }

    return (
        <div className='home-meet-up-card' onClick={() => goToMeetUpDetail(meetUp._id)}>
            <div className='img'>
                <img src={meetUp.image} alt='' />
                <div className={'overlay' + (meetUp?.isClosed ? '-finish' : '')}>{meetUp?.isClosed ? "마감" : "모집중"}</div>
                <div className={'category-overlay'}>{meetUp?.category}</div>
            </div>
            <div className='contents'>
                <div className='title'>{meetUp.title}</div>
                <div className='schedule green'>
                    <FontAwesomeIcon icon={faLocationDot} style={{ color: "#28A745", }} />

                    {meetUp.location === "online" ? 
                        (<span> 온라인 · </span>) : 
                        (<span> {meetUp?.location.split(' ')[1]} · </span>)}

                    {meetUp.date.date === format(new Date(), 'yyyy.MM.dd') ? 
                        (<span> 오늘</span>) : 
                        (<span>{meetUp.date.date}</span>)}
                        
                </div>
                <div className='small-text'>{meetUp.organizer.nickName} · 선착순 {meetUp.currentParticipants}/{meetUp.maxParticipants}</div>
            </div>
        </div>
    )
}

export default HomeMeetUpCard
