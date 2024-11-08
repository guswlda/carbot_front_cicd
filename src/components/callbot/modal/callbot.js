// callbot.js
import React from 'react';
import './callbot.css';

const CallbotModal = ({ onClose }) => {
  return (
    <div className="callbot-modal-overlay" onClick={onClose}>
      <div
        className="callbot-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <p>안녕하세요 카봇의 콜봇입니다!</p>
        <p>AI가 카봇에 대해 알려드릴게요</p>
        <p>02-123-4567</p>
        <button className="callbot-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default CallbotModal;
