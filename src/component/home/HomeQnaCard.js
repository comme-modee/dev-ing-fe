import React from 'react'

const HomeQnaCard = () => {
  return (
    <div className='home-qna-card'>
      <div className='user'>
        <img src="https://cdn-icons-png.flaticon.com/128/847/847969.png" alt="프로필 이미지" />
        <span>홍길동</span>
      </div>
      <div className='content'>
        <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nfGVufDB8fDB8fHww" alt="첨부 이미지" />
        <div className='question'>
          질문 있어요! 저는 왜 이런 오류가 생길까요? 혹시 저와 같은
          문제를 겪으신 분들은 어떻게 해결하셨나요?
        </div>
        <div className='category'>#알고리즘 #아무말</div>
        <div className='comment'>댓글 18개</div>
      </div>
    </div>
  )
}

export default HomeQnaCard