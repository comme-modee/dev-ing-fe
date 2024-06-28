import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import meetingImg from "../asset/img/meeting-img-01.jpg"
import { postActions } from '../action/postAction';
import { qnaActions } from "../action/qnaAction";
import { Dropdown } from 'react-bootstrap';

const MyCommentsTab = ({ uniqueUser }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postList } = useSelector((state) => state.post)
    const { qnaList } = useSelector((state) => state.qna);
    const [myPostComments, setMyPostComments] = useState([]);
    const [myQnaComments, setMyQnaComments] = useState([]);
    const [selectedTab, setSelectedTab] = useState("all")
    const [dropdownText, setDropdownText] = useState("전체 댓글")

    useEffect(() => {
        dispatch(postActions.getPostList());
        dispatch(qnaActions.getQnaList());
    }, [])

    useEffect(() => {
        if (postList) {
            const commentWithPosts = postList
                .filter((post) => 
                post.comments && post.comments.some((comment) => !comment.isDelete && comment.author === uniqueUser._id)
                )
                .map((post) => ({
                    ...post,
                    userComments: post.comments.filter((comment) => !comment.isDelete && comment.author === uniqueUser._id),
                }))
            setMyPostComments(commentWithPosts)
        }
    }, [postList, uniqueUser])

    useEffect(() => {
        if (qnaList) {
            const commentWithQnas = qnaList
                .filter((qna) => 
                qna.answers && qna.answers.some((answer) =>!answer.isDelete && answer.author._id === uniqueUser._id)
            )
                .map((qna) => ({
                    ...qna,
                    userComments: qna.answers.filter((answer) =>!answer.isDelete && answer.author._id === uniqueUser._id),
                }))
            setMyQnaComments(commentWithQnas)
        }
    }, [qnaList, uniqueUser])

    const handleSelect = (tab, text) => {
        setSelectedTab(tab);
        setDropdownText(text);
    };


  return (
      <div className="myComment-tab-container">
        <div className="contents-header-btns">      
        <Dropdown>
            <Dropdown.Toggle className="white-btn">
                {dropdownText}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSelect('all', '전체 댓글')}>전체 댓글</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('posts', '게시물')}>게시물</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('qna', 'QnA')}>QnA</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
      {(selectedTab === 'all' || selectedTab === 'posts') && myPostComments.map((post) => (
        <div className="myComment-tab" key={post._id}>
          <div className="post-content" onClick={() => { navigate(`/post/${post._id}`) }}>
            <img src={post.image || meetingImg} alt="postImg" className="post-image" />
            <div className="post-text">
              <h3>{post.title}</h3>
              <div className="post-details">
                <span>Tags: {post.tags.join(", ")}</span>
                <span>Likes: {post.userLikes.length}</span>
                <span>Posted on: {post.createAt.date} at {post.createAt.time}</span>
              </div>
            </div>
          </div>
          <div className="comments-section">
            {post.userComments.map((comment) => (
              <div className="comment" key={comment._id}>
                <div className="comment-author">
                  <img src={uniqueUser.profileImage} alt="author" className="author-image" />
                  <span className="author-name">{uniqueUser.userName}</span>
                </div>
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <span className="comment-date">{comment.createAt.date} at {comment.createAt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
        {(selectedTab === 'all' || selectedTab === 'qna') && myQnaComments.map((qna) => (
        <div className="myComment-tab" key={qna._id}>
          <div className="post-content" onClick={() => { navigate(`/qna/${qna._id}`) }}>
            <div className="post-text">
              <h3>Q. {qna.title}</h3>
              <div className="post-details">
                <span>{qna.answers.filter(comment => !comment.isDelete).length} 개의 답변</span>
                <span>Tags: {qna.tags.join(", ")}</span>
                <span>게시일: {qna.createAt.date} at {qna.createAt.time}</span>
              </div>
            </div>
          </div>
          <div className="comments-section">
            {qna.userComments.map((answer) => (
              <div className="comment" key={answer._id}>
                <div className="comment-author">
                  <img src={uniqueUser.profileImage} alt="author" className="author-image" />
                  <span className="author-name">{uniqueUser.userName}</span>
                </div>
                <div className="comment-content">
                  <p>{answer.content}</p>
                  <span className="comment-date">{answer.createAt.date} at {answer.createAt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyCommentsTab
