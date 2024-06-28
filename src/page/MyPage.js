import React, { useEffect, useState } from 'react'
import { Nav, Modal, Row, Col } from 'react-bootstrap'
import PostTab from '../component/PostTab';
import "../style/myPage.style.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { userActions } from '../action/userAction';
import ClipLoader from 'react-spinners/ClipLoader';
import MeetUpTab from '../component/MeetUpTab';
import QnaTab from '../component/QnaTab';
import ScrapTab from '../component/ScrapTab';
import MyLikesTab from '../component/MyLikesTab';
import MyCommentsTab from '../component/MyCommentsTab';

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickName } = useParams();
  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const {
    user,
    loading,
    uniqueUser,
    followSuccess,
    unfollowSuccess,
    uniqueUserPost,
    uniqueUserMeetUp,
    uniqueUserQna,
    following,
    followers } = useSelector((state) => state.user);
  const isCurrentUser = user && user.nickName === nickName;
  const stackList = [
    ["Java", "096F90"], ["JavaScript", "F7DF1E"],
    ["TypeScript", "3178C6"], ["Spring", "6DB33F"],
    ["HTML", "E34F26"], ["CSS3", "1572B6"],
    ["jQuery", "0769AD"], ["Oracle", "F80000"],
    ["MySQL", "4479A1"], ["Spring Boot", "6DB33F"],
    ["PHP", "777BB4"], ["Python", "3776AB"],
    ["Node.js", "5FA04E"], ["Swift", "F05138"],
    ["React", "61DAFB"], ["React Native", "61DAFB"],
    ["Angular", "0F0F11"], ["Vue.js", "4FC08D"],
    ["Kotlin", "7F52FF"], ["MSSQL", "4479A1"],
    ["Git", "F05032"], ["Github", "181717"],
    ["Bootstrap", "7952B3"]
  ];

  useEffect(() => {
    dispatch(userActions.getUserByNickName(nickName))
    setTab(0);
  }, [nickName, dispatch])

  useEffect(() => {
    if (followSuccess || unfollowSuccess) {
      dispatch(userActions.getUserByNickName(nickName));
      dispatch(userActions.loginWithToken())
    }
  }, [followSuccess, unfollowSuccess, nickName, dispatch]);

  const handleFollow = () => {
    if (!user) {
      navigate("/login")
    } else {
      dispatch(userActions.followUser(nickName))
    }
  };

  const handleUnfollow = () => {
    dispatch(userActions.unfollowUser(nickName))
  }

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  }

  const handleCloseModal = () => setShowModal(false);

  const getProfileImageRank = (rank) => {
    switch (rank.toLowerCase()) {
      case "entry":
        return "entry";
      case "bronze":
        return "bronze";
      case "silver":
        return "silver";
      case "gold":
        return "gold";
      case "platinum":
        return "platinum";
      case "diamond":
        return "diamond";
      case "master":
        return "master";
      case "challenger":
        return "challenger";
      default:
        return "entry";
    }
  }

  if (loading) {
    return <div className='loading'><ClipLoader color="#28A745" loading={loading} size={100} /></div>
  }

  if (!uniqueUser) {
    return <div>User not found</div>;
  }

  const isFollowing = user && user.following && user.following.includes(uniqueUser._id)

  return (
    <div className="my-page-container">
      <div className="profile-section">
        <img
          src={uniqueUser.profileImage}
          alt="Profile"
          className={`profile-image ${getProfileImageRank(uniqueUser.rank)}`}
        />
        <div className="profile-info">
          <div className="user-info">
            <h2 className="user-name">
              {uniqueUser.userName} <span className="user-rank">{uniqueUser.rank}</span>
              {!isCurrentUser && (
                <button className="follow-button" onClick={isFollowing ? handleUnfollow : handleFollow}>
                  {isFollowing ? "언팔로우" : "팔로우"}
                </button>
              )}
            </h2>
            <div className="stacks-container">
              {uniqueUser.stacks && uniqueUser.stacks.map(
                (stack) => {
                  const matchedStacks = stackList.find((item) => item[0] === stack)
                  return matchedStacks ? (
                    <img
                      key={stack}
                      src={`https://img.shields.io/badge/${matchedStacks[0]}-${matchedStacks[1]}?style=for-the-badge&logo=${matchedStacks[0]}&logoColor=white`}
                      alt={stack}
                    />
                  ) : null;
                }
              )}
            </div>
          </div>
          <div className="follow-info">
            <div className="follow-item">
              <p className="follow-label">나의 활동</p>
              <p className="follow-count">
                {uniqueUserPost.length
                  + uniqueUserMeetUp.length
                  + uniqueUserQna.length
                  + uniqueUser.scrap.length}
              </p>
            </div>
            <div className="follow-item" onClick={() => handleShowModal("followers")}>
              <p className="follow-label">Followers</p>
              <p className="follow-count">{uniqueUser.followers ? uniqueUser.followers.length : 0}</p>
            </div>
            <div className="follow-item" onClick={() => handleShowModal("following")}>
              <p className="follow-label">Following</p>
              <p className="follow-count">{uniqueUser.following ? uniqueUser.following.length : 0}</p>
            </div>
          </div>
        </div>
        <p className="description">{uniqueUser.description}</p>
      </div>

      <Nav variant="tabs" defaultActiveKey="post" className="custom-nav">
        <Nav.Item>
          <Nav.Link onClick={() => setTab(0)} eventKey="post">Post</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setTab(1)} eventKey="meetUp">MeetUp</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setTab(2)} eventKey="qna">Q&A</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setTab(3)} eventKey="scrap">Scrap</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setTab(4)} eventKey="myLikes">My Likes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setTab(5)} eventKey="myComments">My Comments</Nav.Link>
        </Nav.Item>
      </Nav>

      <TabContent
        tab={tab}
        uniqueUser={uniqueUser}
        uniqueUserPost={uniqueUserPost}
        uniqueUserMeetUp={uniqueUserMeetUp}
        uniqueUserQna={uniqueUserQna}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'following' ? 'Following' : 'Followers'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'following' ? (
            following.map((user) => (
              <div
                key={user._id}
                className='user-item'
                onClick={() => {
                  navigate(`/me/${user.nickName}`);
                  handleCloseModal();
                }
                }>
                <img src={user.profileImage} alt={user.nickName} className='user-profile-image' />
                <div className='user-info'>
                  <span className='user-nickName'>{user.nickName}</span>
                  <span className='user-userName'>{user.userName}</span>
                </div>
              </div>
            ))
          ) : (
            followers.map((user) => (
              <div
                key={user._id}
                className='user-item'
                onClick={() => {
                  navigate(`/me/${user.nickName}`)
                  handleCloseModal();
                }
                }>
                <img src={user.profileImage} alt={user.nickName} className='user-profile-image' />
                <div className='user-info'>
                  <span className='user-nickName'>{user.nickName}</span>
                  <span className='user-userName'>{user.userName}</span>
                </div>
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

const TabContent = ({ tab, uniqueUser, uniqueUserPost, uniqueUserMeetUp, uniqueUserQna }) => {
  if (tab === 0) {
    return <Row>
      {uniqueUserPost && uniqueUserPost.map((post) => (
        <Col key={post._id} xs={12} sm={6} md={4} lg={4}>
          <PostTab post={post} key={post._id} />
        </Col>
      ))}
    </Row>
  }

  if (tab === 1) {
    return <div className="meetUp-container">
      {uniqueUserMeetUp && uniqueUserMeetUp.map((meetUp) => (
        <MeetUpTab meetUp={meetUp} key={meetUp._id} />
      ))}
    </div>
  }

  if (tab === 2) {
    return <>
      {uniqueUserQna && uniqueUserQna.map((qna) => (
        <QnaTab qna={qna} key={qna._id} />
      ))}
    </>
  }
  if (tab === 3) {
    return <ScrapTab uniqueUser={uniqueUser} />
  }
  if (tab === 4) {
    return <MyLikesTab uniqueUser={uniqueUser} />
  }
  if (tab === 5) {
    return <MyCommentsTab uniqueUser={uniqueUser} />
  }

}

export default MyPage