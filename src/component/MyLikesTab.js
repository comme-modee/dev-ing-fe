import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postActions } from '../action/postAction';
import meetingImg from "../asset/img/meeting-img-03.jpg"
import { useNavigate } from 'react-router-dom';
import { Col, Row, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

const MyLikesTab = ({uniqueUser}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postList } = useSelector((state) => state.post);
    const [likedPosts, setLikedPosts] = useState([]);
    

    useEffect(() => {
        dispatch(postActions.getPostList())
    }, [])

    useEffect(() => {
    if (postList) {
      const filteredPosts = postList.filter((post) => 
        post.userLikes && post.userLikes.includes(uniqueUser._id)
      );
      setLikedPosts(filteredPosts);
    }
  }, [postList, uniqueUser]);

  return (
      <Row>
      {likedPosts.map((post) => (
        <Col key={post._id} xs={12} sm={6} md={4} lg={4}>
                <Card className="mypagetab-card shadow-sm" onClick={() => { navigate(`/post/${post._id}`) }}>
                <Card.Img variant="top" src={post.image || meetingImg} alt={post.title} className="card-thumbnail" />
                <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <div className="tags">
                    {post.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">#{tag}</Badge>
                    ))}
                </div>
                <div className="user-likes mt-2">
                    <span className="me-3">
                        <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /> {post.likes}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faComment} /> {post.comments.filter(comment => !comment.isDelete).length}
                    </span>
                </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                생성 날짜: {post.createAt.date} {post.createAt.time}
                </Card.Footer>
            </Card>
          </Col>
      ))}
    </Row>
  )
}

export default MyLikesTab
