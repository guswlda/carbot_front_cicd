import React from "react";
import { MdOutlineClose } from "react-icons/md";
import "./memoModal.css";

const MemoModal = ({
  isOpen,
  consultDetails,
  memoContent,
  onChangeMemoContent,
  onClose,
  onSave,
  isEditMode,
}) => {
  if (!isOpen || !consultDetails) return null;

  return (
    <div className="memo-modal-overlay">
      <div className="memo-modal">
        <button className="memo-close-button" onClick={onClose}>
          <MdOutlineClose size={24} />
        </button>
        <h3>상담 접수 번호: {consultDetails.custom_consult_no}</h3>
        <p>신청자: {consultDetails.customer_name}</p>
        <p>전화번호: {consultDetails.customer_phone || "정보 없음"}</p>
        <p>성별: {consultDetails.customer_gender || "정보 없음"}</p>
        <div className="memo-customer-info">
          <p>고객 요청사항: {consultDetails.custom_content}</p>
        </div>
        <textarea
          className="memo-textarea"
          value={memoContent}
          onChange={(e) => onChangeMemoContent(e.target.value)}
          placeholder="메모를 작성하세요."
        />
        <button
          className={`memo-save-button ${
            isEditMode ? "memo-edit-button" : "memo-register-button"
          }`}
          onClick={onSave}
        >
          {isEditMode ? "메모 수정" : "메모 등록"}
        </button>
      </div>
    </div>
  );
};

export default MemoModal;
