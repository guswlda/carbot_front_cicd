import React, { useState } from "react";
import PropTypes from "prop-types"; // PropTypes 추가
import "./NoticeForm.css";
import axios from "axios";

const NoticeForm = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("공지"); // 기본값 설정
  const [content, setContent] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin_id = localStorage.getItem("userId");
    if (!admin_id) {
      setError("관리자 ID가 유효하지 않습니다. 다시 로그인해 주세요.");
      return;
    }

    const newNotice = {
      notice_title: title,
      notice_category: category,
      notice_content: content,
    };

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(
        `http://222.112.27.120:8001/add_notice/${admin_id}`,
        newNotice
      );
      onSubmit(newNotice); // 부모 컴포넌트에 새 공지사항 전달
      setTitle("");
      setCategory("공지");
      setContent("");
      onClose();
    } catch (error) {
      setError("공지사항 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
      console.error("Error adding notice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notice-form-modal" onClick={(e) => e.stopPropagation()}>
        <h2>공지사항 등록</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* 에러 메시지 표시 */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting} // 로딩 중 입력 비활성화
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting} // 로딩 중 입력 비활성화
          >
            <option value="공지">공지</option>
            <option value="이벤트">이벤트</option>
          </select>
          <textarea
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting} // 로딩 중 입력 비활성화
            required
          />
          <div className="form-buttons">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록"}{" "}
              {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes를 사용하여 props 검증
NoticeForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NoticeForm;
