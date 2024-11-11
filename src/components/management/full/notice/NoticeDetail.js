import React, { useState } from "react";
import "./NoticeDetail.css";

const NoticeDetail = ({ notice, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(notice.notice_title);
  const [content, setContent] = useState(notice.notice_content);
  const [category, setCategory] = useState(notice.notice_category);

  const handleUpdate = () => {
    const updatedNotice = {
      notice_no: notice.notice_no,
      notice_title: title,
      notice_category: category,
      notice_content: content,
    };
    onUpdate(updatedNotice); // 수정 처리
  };

  const handleDelete = () => {
    onDelete(notice.notice_no); // 삭제 처리
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notice-detail-modal" onClick={(e) => e.stopPropagation()}>
        <h2>공지사항 수정</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="공지">공지</option>
          <option value="이벤트">이벤트</option>
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button onClick={handleUpdate}>수정</button>
        <button onClick={handleDelete}>삭제</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default NoticeDetail;
