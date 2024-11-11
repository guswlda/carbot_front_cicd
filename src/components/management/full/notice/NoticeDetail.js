import React, { useState, useEffect } from "react";
import "./NoticeDetail.css";

const NoticeDetail = ({ notice, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 내용
  const [category, setCategory] = useState("공지"); // 카테고리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // `notice` 데이터가 변경될 때마다 상태 초기화
  useEffect(() => {
    if (notice) {
      console.log("Notice data:", notice); // 전달된 데이터 확인
      setTitle(notice.notice_title || "");
      setContent(notice.notice_content || "");
      setCategory(notice.notice_category || "공지");
    }
  }, [notice]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const updatedNotice = {
      notice_no: notice.notice_no,
      notice_title: title.trim(),
      notice_category: category.trim(),
      notice_content: content.trim(),
    };

    try {
      await onUpdate(updatedNotice);
      onClose();
    } catch (error) {
      setError("공지사항 수정 중 문제가 발생했습니다.");
      console.error("Error updating notice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(notice.notice_no);
      onClose();
    } catch (err) {
      setError("공지사항 삭제 중 문제가 발생했습니다.");
      console.error("Error deleting notice:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notice-detail-modal" onClick={(e) => e.stopPropagation()}>
        <h2>공지사항 수정</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          required
        >
          <option value="공지">공지</option>
          <option value="이벤트">이벤트</option>
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          placeholder="내용을 입력하세요."
          required
        />
        <div className="notice-detail-button-group">
          <button
            className="notice-detail-update-button"
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정"}
          </button>
          <button
            className="notice-detail-delete-button"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "삭제 중..." : "삭제"}
          </button>
          <button
            className="notice-detail-close-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
