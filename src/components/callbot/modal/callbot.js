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
        <p>안녕하세요 카봇의 AI 콜봇입니다!</p>
        <p>국제 전화 입니다.</p>
        <p> 한국 전화로 변경 예정</p>
        <p>+12058405763</p>
        <button className="callbot-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default CallbotModal;
