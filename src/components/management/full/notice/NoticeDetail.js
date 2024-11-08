import React, { useState } from 'react';
import './NoticeDetail.css';

const NoticeDetail = ({ notice, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(notice.title);
  const [category, setCategory] = useState(notice.category);
  const [content, setContent] = useState(notice.content);

  const handleUpdate = () => {
    const updatedNotice = { ...notice, title, category, content };
    onUpdate(updatedNotice); // 수정 처리
  };

  const handleDelete = () => {
    onDelete(notice.id); // 삭제 처리
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
      </div>
    </div>
  );
};

export default NoticeDetail;
