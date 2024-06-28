import React, { useEffect, useState } from "react";
import QnaCard from "../component/QnaCard";
import "../style/qna.style.css";
import WriteBtn from "../component/WriteBtn";
import { useDispatch, useSelector } from "react-redux";
import { qnaActions } from "../action/qnaAction";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorCard from "../component/ErrorCard";

const Qna = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ query, setQuery ] = useSearchParams();
    const { qnaList, error } = useSelector((state) => state.qna);
    const [ keywordValue, setKeywordValue ] = useState('');

    const [ searchQuery, setSearchQuery ] = useState({
        category: query.get("category") || '',
        keyword: query.get("keyword") || '',
      });
    
      const updateQueryParams = () => {
        const { keyword, category } = searchQuery;
        const queryParams = new URLSearchParams();
        
        if (keyword) queryParams.set('keyword', keyword);
        if (category) queryParams.set('category', category);
    
        navigate(`/qna?${queryParams.toString()}`);
      };
    
      useEffect(() => {
        dispatch(qnaActions.getQnaList({ ...searchQuery }));
        updateQueryParams();
      }, [searchQuery.category, searchQuery.keyword]);
    
      const onCheckEnter = (e) => {
        if (e.key === "Enter") {
          setSearchQuery(prevState => ({
            ...prevState,
            keyword: e.target.value || ''
          }));
          updateQueryParams();
        }
      };
    
      const getQnaListByCategory = (category) => {
        setSearchQuery(prevState => ({
          ...prevState,
          category: category
        }));
        updateQueryParams();
      };

    return (
        <div>
            <div className="qna-container">
                <div className='contents-header-btns'>
                    <input 
                    type='text' 
                    placeholder='검색어를 입력하세요' 
                    className='form-control search-input'
                    value={keywordValue}
                    onKeyUp={(e) => onCheckEnter(e)}
                    onChange={(e) => setKeywordValue(e.target.value)}
                    />
                    
                    <Dropdown>
                        <Dropdown.Toggle>
                            카테고리
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>카테고리별로 모아보기</Dropdown.Header>
                            <Dropdown.Item onClick={() => getQnaListByCategory('tech')}>기술</Dropdown.Item>
                            <Dropdown.Item onClick={() => getQnaListByCategory('career')}>커리어</Dropdown.Item>
                            <Dropdown.Item onClick={() => getQnaListByCategory('etc')}>기타</Dropdown.Item>
                            <Dropdown.Item onClick={() => getQnaListByCategory('all')}>전체</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <WriteBtn type='qna'/>
                </div>
                {error ? 
                    <ErrorCard errorMessage={error}/> : 
                    qnaList?.map((qna) => (
                        <QnaCard key={qna._id} qna={qna}/>
                ))}
            </div>
        </div>
    );
};

export default Qna;
