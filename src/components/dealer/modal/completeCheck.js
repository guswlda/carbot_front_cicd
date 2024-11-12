import React from "react";
import "./completeCheck.css";

const CompleteCheck = ({ isOpen, customerName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="complete-check-modal-overlay" onClick={onCancel}>
      <div
        className="complete-check-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{customerName} 님의 상담을 완료하시겠습니까?</h3>
        <div className="complete-check-button-group">
          <button onClick={onConfirm} className="complete-check-confirm">
            확인
          </button>
          <button onClick={onCancel} className="complete-check-cancel">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteCheck;
