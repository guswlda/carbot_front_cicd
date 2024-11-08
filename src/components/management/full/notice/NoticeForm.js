import React, { useState } from "react";
import "./NoticeForm.css";
import axios from "axios";

const NoticeForm = ({ onClose, onSubmit, admin_id }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("공지");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Admin ID:", admin_id);
    const newNotice = {
      notice_title: title,
      notice_category: category,
      notice_content: content,
    };

    try {
      await axios.post(
        `http://localhost:8001/add_notice/${admin_id}`,
        newNotice
      );
      onSubmit(newNotice);
      onClose();
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notice-form-modal" onClick={(e) => e.stopPropagation()}>
        <h2>공지사항 등록</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="공지">공지</option>
            <option value="이벤트">이벤트</option>
          </select>
          <textarea
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">등록</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
