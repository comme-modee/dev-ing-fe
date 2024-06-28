import React, { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-md-editor";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import CloudinaryUploadWidgetForWrite from "../utils/CloudinaryUploadWidgetForWrite";
import { qnaActions } from "../action/qnaAction";
import { commonUiActions } from "../action/commonUiAction";
import { Form } from "react-bootstrap";

const initialFormData = {
    title: "",
    content: "",
    category: ''
};

const QnaWrite = ({ mode }) => {
    const [markDown, setMarkdown] = useState("");
    const [formData, setFormData] = useState({ ...initialFormData });
    const [contentError, setContentError] = useState("");
    const { user } = useSelector((state) => state.user);
    const { selectedQna } = useSelector((state) => state.qna);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const [ category, setCategory ] = useState(selectedQna.category || '');

    useEffect(() => {
        if (type === "update" && selectedQna) {
            setFormData({
                title: selectedQna.title,
                content: selectedQna.content,
                category: selectedQna.category
            });
            setMarkdown(selectedQna.content);
        } else {
            setFormData({ ...initialFormData });
            setMarkdown("");
        }
    }, [type, selectedQna]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    const createQuestion = () => {
        if (formData.title === "") {
            dispatch(commonUiActions.showToastMessage("제목을 입력해주세요.", "error"));
            return;
        }
        if (markDown === "") {
            dispatch(commonUiActions.showToastMessage("내용을 입력해주세요.", "error"));
            return;
        }
        if(category === '') {
            dispatch(commonUiActions.showToastMessage("카테고리를 선택해주세요.", "error"));
            return;
        }

        const newFormData = { ...formData, content: markDown, category };

        if (type === "new") {
            dispatch(qnaActions.createQna(newFormData, navigate));
        } else {
            dispatch(qnaActions.updateQna(newFormData, selectedQna._id, navigate));
        }
    };

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    const uploadContentImage = (url) => {
        setMarkdown(markDown + `![image](${url})`);
    };

    return (
        <div className="write-form-container">
            <div className="write-form">
                <div className="top">
                    <Form.Select defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value=''>카테고리</option>
                        <option value="tech">기술</option>
                        <option value="career">커리어</option>
                        <option value="etc">기타</option>
                    </Form.Select>
                    <button className="green-btn" onClick={createQuestion}>
                        {type === "new" ? "등록" : "수정"}
                    </button>
                </div>
                <div className="qna-write-title">
                    <input
                        id="title"
                        type="text"
                        placeholder="제목을 입력해주세요"
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <strong className="small-btn">본문에 사진 추가 </strong>
                    <CloudinaryUploadWidgetForWrite
                        uploadContentImage={uploadContentImage}
                    />
                </div>
                <div id="content" className="qna-write-content">
                    <div data-color-mode="light">
                        <span className="error">{contentError}</span>
                        <MarkdownEditor
                            height={600}
                            value={markDown}
                            highlightEnable={false}
                            onChange={setMarkdown}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QnaWrite;
