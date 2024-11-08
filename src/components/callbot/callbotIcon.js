import React, { useState } from 'react';
import CallbotModal from './modal/callbot';
import './callbotIcon.css';
import botImage from './callbot_img.png';

const CallbotIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* 우측 하단에 고정된 아이콘 */}
      <div className="callbot-icon" onClick={openModal}>
        <img src={botImage} alt="Callbot Icon" className="bot-image" />
      </div>

      {/* 모달 창 */}
      {isModalOpen && <CallbotModal onClose={closeModal} />}
    </div>
  );
};

export default CallbotIcon;
