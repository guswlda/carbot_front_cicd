import React from "react";
import "./Consultations.css";

const ConsultationModal = ({ consultation, onClose }) => {
  console.log("Modal consultation data:", consultation); // 데이터 전달 확인
  return (
    <div className="consultations-modal-overlay" onClick={onClose}>
      <div
        className="consultations-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>상담 상세</h3>
        <p>
          <strong>번호:</strong> {consultation.custom_consult_no}
        </p>
        <p>
          <strong>접수된 상담:</strong>{" "}
          {consultation.customer_name || "정보 없음"}
        </p>
        <p>
          <strong>담당자:</strong> {consultation.dealer_name || "정보 없음"}
        </p>
        <p>
          <strong>작성일:</strong>{" "}
          {new Date(consultation.created_at).toLocaleDateString()}
        </p>
        <div className="consultation-content">
          <strong>상담 내용:</strong>
          <p>{consultation.consult_content || "메모가 없습니다."}</p>
        </div>
        <button onClick={onClose} className="modal-close-button">
          닫기
        </button>
      </div>
    </div>
  );
};

export default ConsultationModal;
