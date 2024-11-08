import React from 'react';
import './Consultations.css';

const ConsultationModal = ({ consultation, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="consultation-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>상담관리</h2>
        <div className="consultation-details">
          <h3>
            번호: {consultation.id} | {consultation.status}
          </h3>
          <p>{consultation.details}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
