import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../action/userAction";
import '../style/navbar.style.css'
import { Dropdown } from "react-bootstrap";
import messageIcon from '../asset/img/message-icon.png'

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  // const [ showSearchBox, setShowSearchBox ] = useState(false);
  const menuList = ["POST", "MEETUP", "Q&A" ];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  // const onCheckEnter = (event) => {
  //   if (event.key === "Enter") {
  //     if (event.target.value === "") {
  //       return navigate("/");
  //     }
  //     navigate(`?name=${event.target.value}`);
  //   }
  // };

  const logout = () => {
    dispatch(userActions.logout());
  };

  return (
    <div>
      {/* {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )} */}

      {/* 모바일에서 나오는 사이드바 */}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button
              key={index}
              onClick={() => {
                setWidth(0);
                menu === "Q&A" ? navigate(`/qna`) : navigate(`/${menu.toLowerCase()}`);
              }}
            >{menu}
            </button>
          ))}
        </div>
      </div>

      <div className="burger-menu hide">
        <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
      </div>
      {/* 홈페이지 메인 Navbar */}
      <div className="nav-header">
        {/* 메인 로고 */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          <img width={150} src="/img/logo.png" alt="logo.png" />
        </div>

        {/* Nav menuList */}
        <div className="nav-menu">
          {!isMobile && (<>
            <div onClick={() => navigate("/post")} className="nav-icon">
              <span style={{ cursor: "pointer" }}>POST</span>
            </div>
            <div onClick={() => navigate("/meetup")} className="nav-icon">
              <span style={{ cursor: "pointer" }}>MEETUP</span>
            </div>
            <div onClick={() => navigate("/qna")} className="nav-icon">
              <span style={{ cursor: "pointer" }}>Q&A</span>
            </div></>
          )}

          {user &&
            <Dropdown>
              <Dropdown.Toggle className="profile-dropdown">
                <div className="img"><img width={25} src={user.profileImage} alt=''/></div>
                <span>{user.nickName}</span>
              </Dropdown.Toggle>
        
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate(`/me/${user.nickName}`)}>MY DEV</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/account")}>내 계정 정보</Dropdown.Item>
                {user.level === "admin" ? <Dropdown.Item onClick={() => navigate("/admin")}>관리자페이지</Dropdown.Item>:''}
              </Dropdown.Menu>
            </Dropdown>}

            <img src={messageIcon} alt="message Icon" className="message-icon" onClick={() => {navigate('/chat')}}/>

          {user ? (
            <div onClick={logout} className="nav-icon green-btn">
              <span style={{ cursor: "pointer" }}>로그아웃</span>
            </div>
          ) : (
            <div onClick={() => navigate("/login")} className="nav-icon green-btn">
              <span style={{ cursor: "pointer" }}>로그인</span>
            </div>
          )}
        </div>
      </div>


      {/* <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href={`/${menu.toLowerCase()}`}>{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Navbar;
